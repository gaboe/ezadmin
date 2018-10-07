namespace BLogic.EzAdmin.GraphQL

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
            ]
        )