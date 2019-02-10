namespace BLogic.EzAdmin.Api


module HttpHandlers =

    open Microsoft.AspNetCore.Http
    open FSharp.Control.Tasks.V2.ContextInsensitive
    open Giraffe
    open BLogic.EzAdmin.Domain.GraphQL

    let okWithJson x : HttpHandler = setStatusCode 200 >=> json x

    let badRequest : HttpHandler = setStatusCode 400 >=> text "Bad request"
    
    let getToken (ctx : HttpContext) = 
        ctx.Request.Headers 
                        |> Seq.tryFind (fun k -> k.Key = "Authorization")
                        |> Option.bind (fun header -> header.Value 
                                                        |> Seq.tryItem 0 
                                                        |> Option.bind (fun t -> t.Replace("Bearer ","") |> Some))

    let graphql (next : HttpFunc) (ctx : HttpContext) = task {
        let token = getToken ctx
               
        let body = ctx.BindQueryString<UnsafeGraphQlQuery>()

        let result = BLogic.EzAdmin.GraphQL.QueryProcessor.processQuery body token
        match result with 
            | Some r -> return! okWithJson r next ctx
            | None -> return! badRequest next ctx

    }