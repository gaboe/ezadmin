namespace BLogic.EzAdmin.GraphQL
#nowarn "40"

open FSharp.Data.GraphQL
open FSharp.Data.GraphQL.Types
open FSharp.Data.GraphQL.Server.Middlewares
open BLogic.EzAdmin.Domain.SqlTypes
open BLogic.EzAdmin.Domain.SqlTypes
open BLogic.EzAdmin.Core.Services.SqlTypes.SqlTypeService

module QueryGraphQLTypes = 
    open BLogic.EzAdmin.Domain.UiTypes

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
        Define.Object<App>(
            name = "App",
            description = "",
            isTypeOf = (fun o -> o :? App),
            fieldsFn = fun () ->
            [
                Define.Field("pages", ListOf (PageType), "Pages in app", fun _ (x: App) -> x.Pages)
                Define.Field("menuItems", ListOf (MenuItemType), "Menu items", fun _ (x: App) -> x.MenuItems)
            ]
        )


