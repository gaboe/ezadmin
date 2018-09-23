namespace BLogic.EzAdmin.GraphQL

type Root =
    { ClientId: string }

module GraphQLSchema = 
    open FSharp.Data.GraphQL
    open FSharp.Data.GraphQL.Types
    open FSharp.Data.GraphQL.Server.Middlewares
    open BLogic.EzAdmin.Domain.SqlTypes
    open BLogic.EzAdmin.Core.Services.SqlTypes.SqlTypeService
    
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
                Define.Field("tables", ListOf (SqlTableType), "Get db tables by schema name", [ Define.Input("schemaName", String) ], fun ctx _ -> ctx.Arg("schemaName") |> getTables |> Async.RunSynchronously)
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