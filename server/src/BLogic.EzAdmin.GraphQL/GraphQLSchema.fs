namespace BLogic.EzAdmin.GraphQL
#nowarn "40"

type Root =
    { ClientId: string }


module GraphQLSchema = 
    open FSharp.Data.GraphQL
    open FSharp.Data.GraphQL.Types
    open FSharp.Data.GraphQL.Server.Middlewares
    open BLogic.EzAdmin.Domain.SqlTypes
    open BLogic.EzAdmin.Domain.UiTypes
    open BLogic.EzAdmin.Core.Services.SqlTypes.SqlTypeService

    type SqlColumnDataType = Int | Nvarchar | Unknown

    type [<CLIMutable>] AppInputType = {hej: string;}
    type [<CLIMutable>] AppEzType = {hej: string option;}
    

    //type TestInputs with 
    // static member FromJson (v : TestInputs) =
    //  match v with
        
    let TestInputObject =
      Define.InputObject<TestInput>(
        name = "TestInputObject",
        fields = [
            Define.Input("a", Nullable String)
        ])


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
            description = "Db schema",
            isTypeOf = (fun o -> o :? SqlSchema),
            fieldsFn = fun () ->
            [
                Define.Field("schemaName", String, "Schema name", fun _ (x: SqlSchema) -> x.SchemaName)
            ]
        )

    and SqlReferenceType = 
        Define.Object<SqlReference>(
            name = "SqlReference",
            description = "Relation between table reference constrains",
            isTypeOf = (fun o -> o :? SqlReference),
            fieldsFn = fun () ->
            [
                Define.Field("referenceName", String, "Name of reference", fun _ (x: SqlReference) -> x.ReferenceName)
                Define.Field("fromSchema", String, "", fun _ (x: SqlReference) -> x.FromSchema)
                Define.Field("fromTable", String, "", fun _ (x: SqlReference) -> x.FromTable)
                Define.Field("fromColumn", String, "", fun _ (x: SqlReference) -> x.FromColumn)
                Define.Field("toSchema", String, "", fun _ (x: SqlReference) -> x.ToSchema)
                Define.Field("toTable", String, "", fun _ (x: SqlReference) -> x.ToTable)
                Define.Field("toColumn", String, "", fun _ (x: SqlReference) -> x.ToColumn)
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
                Define.Field("referencesToTable", ListOf (SqlReferenceType), "Column references to this table", fun _ (x: SqlTable) -> getReferencesToTable x.TableName |> Async.RunSynchronously)
                Define.Field("referencesFromTable", ListOf (SqlReferenceType), "Column references from this table to other tables", fun _ (x: SqlTable) -> getReferencesFromTable x.TableName |> Async.RunSynchronously)
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
    
    and ColumnType = 
        Define.Object<Column>(
            name = "Column",
            description = "",
            isTypeOf = (fun o -> o :? Column),
            fieldsFn = fun () ->
            [
                Define.Field("name", String, "", fun _ (x: Column) -> x.Name)
                Define.Field("value", String, "", fun _ (x: Column) -> x.Value)
            ]
        )

    and RowType = 
        Define.Object<Row>(
            name = "Row",
            description = "",
            isTypeOf = (fun o -> o :? Row),
            fieldsFn = fun () ->
            [
                Define.Field("key", String, "Represents unique key of row", fun _ (x: Row) -> x.Key)
                Define.Field("columns", ListOf (ColumnType), "Multiple properties of record", fun _ (x: Row) -> x.Columns)
            ]
        )
    
    and TableType = 
        Define.Object<Table>(
            name = "Table",
            description = "",
            isTypeOf = (fun o -> o :? Table),
            fieldsFn = fun () ->
            [
                Define.Field("rows", ListOf (RowType), "Rows in talbe", fun _ (x: Table) -> x.Rows)
            ]
        )

    and PageType = 
        Define.Object<Page>(
            name = "Page",
            description = "",
            isTypeOf = (fun o -> o :? Page),
            fieldsFn = fun () ->
            [
                Define.Field("table", TableType, "Table on page", fun _ (x: Page) -> x.Table)
            ]
        )
    and MenuItemType = 
        Define.Object<MenuItem>(
            name = "MenuItem",
            description = "",
            isTypeOf = (fun o -> o :? MenuItem),
            fieldsFn = fun () ->
            [
                Define.Field("name", String, "Table on page", fun _ (x: MenuItem) -> x.Name)
                Define.Field("rank", SchemaDefinitions.Int, "Table on page", fun _ (x: MenuItem) -> x.Rank)
            ]
        )
    and AppType = 
        Define.Object<AppEzType>(
            name = "App",
            description = "",
            isTypeOf = (fun o -> o :? AppEzType),
            fieldsFn = fun () ->
            [
                Define.Field("menuItems", Nullable String, "Menu items", fun _ (x: AppEzType) -> x.hej)
                //Define.Field("pages", ListOf (PageType), "Pages in app", fun _ (x: App) -> x.Pages)
                //Define.Field("menuItems", ListOf (MenuItemType), "Menu items", fun _ (x: App) -> x.MenuItems)
            ]
        )

     and AppPreviewInputType = 
        Define.InputObject<AppEzType>(
            name = "App",
            fieldsFn = fun () ->
            [
                Define.Input("hej", String)
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
    let _column: Column = {Name = "Hje"; Value = "1100"}
    let _row: Row = {Key= "1"; Columns= [_column]}
    let _table: Table = {Rows = [_row]}
    let _page: Page = {Table = _table}
    let _menuItem = {Rank = 1; Name = "Users"}
    let _app: App = {Pages = [ _page ]; MenuItems = [_menuItem]}
    let _ezApp: AppEzType = {hej = Some ",adalada"}
    
    let Query =
        Define.Object<Root>(
            name = "Query",
            fields = [
                Define.Field("fieldWithObjectInput", AppType, "", [ Define.Input("input", Nullable TestInputObject) ], fun _ __ -> _ezApp)
                Define.Field("schemas", ListOf (SqlSchemaType), "Get db schemas", fun _ __ -> getAllSchemas |> Async.RunSynchronously)
                Define.Field("table", Nullable (SqlTableType), "Get db table by table name", [ Define.Input("tableName", String) ], fun ctx _ -> ctx.Arg("tableName") |> getTable |> Async.RunSynchronously)
                Define.Field("tables", ListOf (SqlTableType), "Get db tables by schema name", [ Define.Input("schemaName", String) ], fun ctx _ -> ctx.Arg("schemaName") |> getTables |> Async.RunSynchronously)
                Define.Field("columns", ListOf (SqlColumnType), "Get table columns by table name", [ Define.Input("tableName", String) ], fun ctx _ -> ctx.Arg("tableName") |> getColumns |> Async.RunSynchronously)
                //Define.Field("appPreview", AppType, "Return preview of app", [ Define.Input("tableName", AppPreviewInputType) ],  fun _ __ -> _ezApp)
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