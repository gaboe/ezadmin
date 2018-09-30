namespace BLogic.EzAdmin.GraphQL

type Root =
    { ClientId: string }

module GraphQLSchema = 
    open FSharp.Data.GraphQL
    open FSharp.Data.GraphQL.Types
    open FSharp.Data.GraphQL.Server.Middlewares
    open BLogic.EzAdmin.Domain.SqlTypes
    open BLogic.EzAdmin.Domain.UiTypes
    open BLogic.EzAdmin.Core.Services.SqlTypes.SqlTypeService
    open BLogic.EzAdmin.GraphQL.InputGraphQLTypes
    open BLogic.EzAdmin.GraphQL.QueryGraphQLTypes

    let schemaConfig = SchemaConfig.Default
    
    let RootType =
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
    let _column: Column = {Name = "Hje"; Value = "1100"}
    let _row: Row = {Key= "1"; Columns= [_column]}
    let _table: Table = {Rows = [_row]}
    let _page: Page = {Table = _table}
    let _menuItem = {Rank = 1; Name = "Users"}
    let _app: App = {Pages = [ _page ]; MenuItems = [_menuItem]}
    //let _ezApp: AppEzType = {hej = Some ",adalada"}
    
    let Query =
        Define.Object<Root>(
            name = "Query",
            fields = [
                Define.Field("schemas", ListOf (SqlSchemaType), "Get db schemas", fun _ __ -> getAllSchemas |> Async.RunSynchronously)
                Define.Field("table", Nullable (SqlTableType), "Get db table by table name", [ Define.Input("tableName", String) ], fun ctx _ -> ctx.Arg("tableName") |> getTable |> Async.RunSynchronously)
                Define.Field("tables", ListOf (SqlTableType), "Get db tables by schema name", [ Define.Input("schemaName", String) ], fun ctx _ -> ctx.Arg("schemaName") |> getTables |> Async.RunSynchronously)
                Define.Field("columns", ListOf (SqlColumnType), "Get table columns by table name", [ Define.Input("tableName", String) ], fun ctx _ -> ctx.Arg("tableName") |> getColumns |> Async.RunSynchronously)
                Define.Field("appPreview", AppType, "Return preview of app", [ Define.Input("input", AppInputType) ],  fun _ __ -> _app)
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