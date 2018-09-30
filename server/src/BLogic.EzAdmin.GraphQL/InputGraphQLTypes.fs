namespace BLogic.EzAdmin.GraphQL

open FSharp.Data.GraphQL.Types

open BLogic.EzAdmin.Domain.GraphQL.InputTypes

module InputGraphQLTypes = 
    
    let ColumnInputType = 
        Define.InputObject<ColumnInput>(
            name = "ColumnInput",
            fieldsFn = fun () ->
            [
                Define.Input("schemaName", String)
                Define.Input("tableName", String)
                Define.Input("columnName", String)
                Define.Input("isKey", Boolean)
                Define.Input("primaryKeyName", Nullable String)
            ]
        )
    let AppInputType = 
        Define.InputObject<AppInput>(
            name = "AppInput",
            fieldsFn = fun () ->
            [
                Define.Input("schemaName", String)
                Define.Input("tableName", String)
                Define.Input("columns", ListOf(ColumnInputType))
            ]
        )