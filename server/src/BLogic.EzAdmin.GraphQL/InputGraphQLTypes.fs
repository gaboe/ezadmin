namespace BLogic.EzAdmin.GraphQL

#nowarn "40"

open FSharp.Data.GraphQL.Types

open BLogic.EzAdmin.Domain.GraphQL

module InputGraphQLTypes = 
    
    let rec ColumnInputType = 
        Define.InputObject<ColumnInput>(
            name = "ColumnInput",
            fieldsFn = fun () ->
            [
                Define.Input("schemaName", String)
                Define.Input("tableName", String)
                Define.Input("columnName", String)
                Define.Input("isPrimaryKey", Boolean)
                Define.Input("isHidden", Boolean)
                Define.Input("keyReference", Nullable(ColumnInputType))
            ]
        )
    let AppInputType = 
        Define.InputObject<AppInput>(
            name = "AppInput",
            fieldsFn = fun () ->
            [
                Define.Input("tableTitle", String)
                Define.Input("schemaName", String)
                Define.Input("tableName", String)
                Define.Input("columns", ListOf(ColumnInputType))
                Define.Input("connection", String)
            ]
        )
    let ChangedColumnType = 
        Define.InputObject<ChangedColumn>(
            name = "ChangedColumn",
            fieldsFn = fun () ->
            [
                Define.Input("name", String)
                Define.Input("value", String)
            ]
        )
    let UpdateEntityInputType = 
        Define.InputObject<UpdateEntityInput>(
            name = "UpdateEntityInput",
            fieldsFn = fun () ->
            [
                Define.Input("pageID", String)
                Define.Input("entityID", String)
                Define.Input("columns", ListOf(ChangedColumnType))
            ]
        )