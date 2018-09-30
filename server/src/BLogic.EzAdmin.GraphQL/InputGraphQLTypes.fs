namespace BLogic.EzAdmin.GraphQL

open FSharp.Data.GraphQL.Types

open BLogic.EzAdmin.Domain.GraphQL.InputTypes

module InputGraphQLTypes = 

    let AppPreviewInputType = 
        Define.InputObject<AppInputType>(
            name = "AppPreviewInput",
            fieldsFn = fun () ->
            [
                Define.Input("schemaName", String)
                Define.Input("tableName", String)
            ]
        )