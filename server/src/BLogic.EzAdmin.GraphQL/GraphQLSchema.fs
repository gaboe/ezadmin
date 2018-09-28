namespace BLogic.EzAdmin.GraphQL
#nowarn "40"

type Root =
    { ClientId: string }

module GraphQLSchema = 
    open FSharp.Data.GraphQL
    open FSharp.Data.GraphQL.Types
    open FSharp.Data.GraphQL.Server.Middlewares
    open BLogic.EzAdmin.Domain.SqlTypes
    open BLogic.EzAdmin.Core.Services.SqlTypes.SqlTypeService

    type SqlColumnDataType = Int | Nvarchar | Unknown
    
    let getSqlColumnDataType sqlDataType = match sqlDataType with 
                                            | "int" -> Int 
                                            | "nvarchar" -> Nvarchar 
                                            | _ -> Unknown

    let SqlColumnDataType =
        Define.Enum(
            name = "SqlColumnDataType",
            options = [
                Define.EnumValue("Int", SqlColumnDataType.Int, "")
                Define.EnumValue("Char", SqlColumnDataType.Nvarchar, "")
                Define.EnumValue("Unknown", SqlColumnDataType.Unknown, "")
             ])

    let schemaConfig = SchemaConfig.Default

    let rec SqlSchemaType =
       Define.Object<SqlSchema>(
            name = "SqlSchema",
            description = "",
            isTypeOf = (fun o -> o :? SqlSchema),
            fieldsFn = fun () ->
            [
                Define.Field("schemaName", String, "Schema name", fun _ (x: SqlSchema) -> x.SchemaName)
            ]
            )

    and SqlTableType = 
        Define.Object<SqlTable>(
            name = "SqlTable",
            description = "",
            isTypeOf = (fun o -> o :? SqlTable),
            fieldsFn = fun () ->
            [
                Define.Field("tableName", String, "Table name", fun _ (x: SqlTable) -> x.TableName)
                Define.Field("schemaName", String, "Schema name", fun _ (x: SqlTable) -> x.SchemaName)
                Define.Field("columns", ListOf (SqlColumnType), "Columns of table", fun _ (x: SqlTable) -> getColumns x.TableName |> Async.RunSynchronously)
            ]
        )

    and SqlColumnType = 
        Define.Object<SqlColumn>(
            name = "SqlColumn",
            description = "",
            isTypeOf = (fun o -> o :? SqlColumn),
            fieldsFn = fun () ->
            [
                Define.Field("columnName", String, "Column name", fun _ (x: SqlColumn) -> x.ColumnName)
                Define.Field("tableName", String, "Table name", fun _ (x: SqlColumn) -> x.TableName)
                Define.Field("schemaName", String, "Schema name", fun _ (x: SqlColumn) -> x.SchemaName)
                Define.Field("dataType", SqlColumnDataType, "", fun _ (h : SqlColumn) -> h.DataType |> getSqlColumnDataType )
            ]
        )
    
    and RootType =
        Define.Object<Root>(
            name = "Root",
            description = "The Root type to be passed to all our resolvers",
            isTypeOf = (fun o -> o :? Root),
            fieldsFn = fun () ->
            [
                Define.Field("clientid", String, "The ID of the client", fun _ r -> r.ClientId)
            ])

    let _schema: SqlSchema = {SchemaName = "makau"} 
    let schemas = [ _schema ] |> List.toSeq

    let Query =
        Define.Object<Root>(
            name = "Query",
            fields = [
                Define.Field("schemas", ListOf (SqlSchemaType), "Get db schemas", fun _ __ -> getAllSchemas |> Async.RunSynchronously)
                Define.Field("table", Nullable (SqlTableType), "Get db table by table name", [ Define.Input("tableName", String) ], fun ctx _ -> ctx.Arg("tableName") |> getTable |> Async.RunSynchronously)
                Define.Field("tables", ListOf (SqlTableType), "Get db tables by schema name", [ Define.Input("schemaName", String) ], fun ctx _ -> ctx.Arg("schemaName") |> getTables |> Async.RunSynchronously)
                Define.Field("columns", ListOf (SqlColumnType), "Get table columns by table name", [ Define.Input("tableName", String) ], fun ctx _ -> ctx.Arg("tableName") |> getColumns |> Async.RunSynchronously)
                ]
            )

    let Subscription =
        Define.SubscriptionObject<Root>(
            name = "Subscription",
            fields = [
                Define.SubscriptionField(
                    "watchMoon",
                    RootType,
                    SqlSchemaType,
                    "Fake subscription",
                    [ Define.Input("id", String) ],
                    (fun ctx _ (p: SqlSchema) -> if ctx.Arg("id") = p.SchemaName then Some p else None)) ])

    let Mutation =
        Define.Object<Root>(
            name = "Mutation",
            fields = [
                Define.Field(
                    "setMoon",
                    Nullable SqlSchemaType,
                    "Sets a moon status",
                    [ Define.Input("id", String); Define.Input("ismoon", Boolean) ],
                    fun ctx _ ->
                        Some _schema
    )])

    let schema = Schema(Query, Mutation, Subscription, schemaConfig)

    let middlewares = 
        [ Define.QueryWeightMiddleware(2.0, true)
          Define.LiveQueryMiddleware() ]

    let executor = Executor(schema, middlewares)

    let root = { ClientId = "5" }