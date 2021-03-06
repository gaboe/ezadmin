﻿namespace BLogic.EzAdmin.GraphQL

open BLogic.EzAdmin.Application.SqlTypes
open BLogic.EzAdmin.Domain.GraphQL

#nowarn "40"

open FSharp.Data.GraphQL.Types
open FSharp.Data.GraphQL.Server.Middlewares
open BLogic.EzAdmin.Domain.SqlTypes
open BLogic.EzAdmin.Application.Models

module QueryGraphQLTypes = 
    open BLogic.EzAdmin.Domain.UiTypes

    type SaveViewResult = {PageID: string option}

    type CreateApplicationResult = {Message: string}

    type DeleteEntityResult = {WasDeleted: bool; Message: string}

    type UpdateEntityResult = {WasUpdated: bool; Message: string}

    type SqlColumnDataType = Int | Decimal | Text | DateTime | Bool | Money | Unknown 
        
    let getSqlColumnDataType sqlDataType = match sqlDataType with 
                                            | "int" -> Int 
                                            | "bigint" -> Int 
                                            | "decimal" -> Decimal
                                            | "float" -> Decimal
                                            | "char" -> Text 
                                            | "nchar" -> Text 
                                            | "varchar" -> Text 
                                            | "nvarchar" -> Text 
                                            | "uniqueidentifier" -> Text
                                            | "date" -> DateTime
                                            | "datetime" -> DateTime
                                            | "datetime2" -> DateTime
                                            | "bit" -> Bool
                                            | "money" -> Money
                                            | _ -> Unknown

    let root (ctx : ResolveFieldContext) =
        let value = ctx.Context.RootValue
        match value with
        | :? Root -> (downcast value : Root) |> Some
        | _ -> None

    let token (value) = root value |> Option.bind (fun e -> e.Token)

    let SqlColumnDataType =
        Define.Enum(
            name = "SqlColumnDataType",
            options = [
                Define.EnumValue("Int", SqlColumnDataType.Int, "")
                Define.EnumValue("Decimal", SqlColumnDataType.Decimal, "")
                Define.EnumValue("Text", SqlColumnDataType.Text, "")
                Define.EnumValue("DateTime", SqlColumnDataType.DateTime, "")
                Define.EnumValue("Bool", SqlColumnDataType.Bool, "")
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
                Define.Field("columns", ListOf (SqlColumnType), "Columns of table", fun ctx (x: SqlTable) -> SqlTypesAppService.getColumns (token ctx) x.TableName)
                Define.Field("referencesToTable", ListOf (SqlReferenceType), "Column references to this table", fun ctx (x: SqlTable) -> SqlTypesAppService.getReferencesToTable (token ctx) x.TableName)
                Define.Field("referencesFromTable", ListOf (SqlReferenceType), "Column references from this table to other tables", fun ctx (x: SqlTable) -> SqlTypesAppService.getReferencesFromTable (token ctx) x.TableName)
            ]
        )

    and SqlColumnType = 
        Define.Object<SqlColumn>(
            name = "SqlColumn",
            description = "",
            isTypeOf = (fun o -> o :? SqlColumn),
            fieldsFn = fun () ->
            [
                Define.Field("isPrimaryKey", Boolean, "Column name", fun _ (x: SqlColumn) -> x.IsPrimaryKey)
                Define.Field("columnName", String, "Column name", fun _ (x: SqlColumn) -> x.ColumnName)
                Define.Field("tableName", String, "Table name", fun _ (x: SqlColumn) -> x.TableName)
                Define.Field("schemaName", String, "Schema name", fun _ (x: SqlColumn) -> x.SchemaName)
                Define.Field("dataType", SqlColumnDataType, "", fun _ (x : SqlColumn) -> x.DataType |> getSqlColumnDataType )
            ]
        )
    
    and ColumnType = 
        Define.Object<Column>(
            name = "Column",
            description = "",
            isTypeOf = (fun o -> o :? Column),
            fieldsFn = fun () ->
            [
                Define.Field("columnAlias", String, "", fun _ (x: Column) -> x.ColumnAlias)
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

     and HeaderType = 
        Define.Object<Header>(
            name = "Header",
            description = "Header of the table",
            isTypeOf = (fun o -> o :? Header),
            fieldsFn = fun () ->
            [
                Define.Field("name", String, "", fun _ (x: Header) -> x.Name)
                Define.Field("alias", String, "", fun _ (x: Header) -> x.Alias)
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
                Define.Field("headers", ListOf (HeaderType), "Headers", fun _ (x: Table) -> x.Headers)
                Define.Field("allRowsCount", SchemaDefinitions.Int, "All records in db without filter", fun _ (x: Table) -> x.AllRowsCount)
            ]
        )

    and PageType = 
        Define.Object<Page>(
            name = "Page",
            description = "",
            isTypeOf = (fun o -> o :? Page),
            fieldsFn = fun () ->
            [
                Define.Field("pageID", String, "", fun _ (x: Page) -> x.PageID)
                Define.Field("table", TableType, "Table on page", fun _ (x: Page) -> x.Table)
                Define.Field("name", String, "Name", fun _ (x: Page) -> x.Name)
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
                Define.Field("pageID", String, "", fun _ (x: MenuItem) -> x.PageID)
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
    and UserAppType = 
        Define.Object<UserApp>(
            name = "UserApp",
            description = "",
            isTypeOf = (fun o -> o :? UserApp),
            fieldsFn = fun () ->
            [
                Define.Field("appID", String, "", fun _ (x: UserApp) -> x.AppID)
                Define.Field("name", String, "Name of app", fun _ (x: UserApp) -> x.Name)
                Define.Field("connection", String, "Connection", fun _ (x: UserApp) -> x.Connection)
                Define.Field("firstAppID", Nullable(String), "", fun _ (x: UserApp) -> x.FirstPageID)
            ]
        )
    and LoginResultType = 
        Define.Object<LoginResult>(
            name = "LoginResult",
            description = "",
            isTypeOf = (fun o -> o :? LoginResult),
            fieldsFn = fun () ->
            [
                Define.Field("token", Nullable(String), "Token", fun _ (x: LoginResult) -> x.Token)
                Define.Field("validationMessage", Nullable(String), "Validation message", fun _ (x: LoginResult) -> x.ValidationMessage)
            ]
        )
    and SaveViewResultType = 
        Define.Object<SaveViewResult>(
            name = "SaveViewResult",
            description = "",
            isTypeOf = (fun o -> o :? SaveViewResult),
            fieldsFn = fun () ->
            [
                Define.Field("pageID", Nullable(String), "", fun _ (x: SaveViewResult) -> x.PageID)
            ]
        )
    and CreateApplicationResultType = 
        Define.Object<CreateApplicationResult>(
            name = "CreateApplicationResult",
            description = "",
            isTypeOf = (fun o -> o :? CreateApplicationResult),
            fieldsFn = fun () ->
            [
                Define.Field("message", String, "", fun _ (x: CreateApplicationResult) -> x.Message)
            ]
        )
    and DeleteEnityResultType = 
           Define.Object<DeleteEntityResult>(
               name = "DeleteRecordResult",
               description = "",
               isTypeOf = (fun o -> o :? DeleteEntityResult),
               fieldsFn = fun () ->
               [
                   Define.Field("wasDeleted", Boolean, "", fun _ (x: DeleteEntityResult) -> x.WasDeleted)
                   Define.Field("message", String, "", fun _ (x: DeleteEntityResult) -> x.Message)
               ]
           )
    and UpdateEntityResultType = 
           Define.Object<UpdateEntityResult>(
               name = "UpdateEntityResult",
               description = "",
               isTypeOf = (fun o -> o :? UpdateEntityResult),
               fieldsFn = fun () ->
               [
                   Define.Field("wasUpdated", Boolean, "", fun _ (x: UpdateEntityResult) -> x.WasUpdated)
                   Define.Field("message", String, "", fun _ (x: UpdateEntityResult) -> x.Message)
               ]
           )
    and EntityColumnType = 
        Define.Object<EntityColumn>(
            name = "EntityColumn",
            description = "",
            isTypeOf = (fun o -> o :? EntityColumn),
            fieldsFn = fun () ->
            [
                Define.Field("columnID", String, "", fun _ (x: EntityColumn) -> x.ColumnID)
                Define.Field("column", ColumnType, "", fun _ (x: EntityColumn) -> x.Column)
            ]
        )
    and EntityType = 
           Define.Object<Entity>(
               name = "Entity",
               description = "Entity from storage",
               isTypeOf = (fun o -> o :? Entity),
               fieldsFn = fun () ->
               [
                   Define.Field("entityID", String, "", fun _ (x: Entity) -> x.EntityID)
                   Define.Field("pageName", String, "", fun _ (x: Entity) -> x.PageName)
                   Define.Field("columns", ListOf (EntityColumnType), "Multiple properties of record", fun _ (x: Entity) -> x.Columns)
               ]
           )


