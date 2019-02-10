namespace BLogic.EzAdmin.Api


module HttpHandlers =

    open Microsoft.AspNetCore.Http
    open FSharp.Control.Tasks.V2.ContextInsensitive
    open Giraffe
    open BLogic.EzAdmin.Api.Models
    open System.IO
    open BLogic.EzAdmin.Domain.GraphQL

    type HttpHandler = HttpFunc -> HttpContext -> HttpFuncResult

    let handleGetHello =
        fun (next : HttpFunc) (ctx : HttpContext) ->
            task {
                let response = {
                    Text = "Hello world, from Giraffe!"
                }
                return! json response next ctx
            }

    let okWithStr str : HttpHandler = setStatusCode 200 >=> text str

    let okWithJson x : HttpHandler = setStatusCode 200 >=> json x

    let readStream (s : Stream) =
        use ms = new MemoryStream(4096)
        s.CopyTo(ms)
        ms.ToArray()
    
    let graphql (next : HttpFunc) (ctx : HttpContext) = task {
        let token = ctx.Request.Headers 
                        |> Seq.tryFind (fun k -> k.Key = "Authorization")
                        |> Option.bind (fun header -> header.Value 
                                                        |> Seq.tryItem 0 
                                                        |> Option.bind (fun t -> t.Replace("Bearer ","") |> Some))
               
        let body = ctx.BindQueryString<UnsafeGraphQlQuery>()

        let result = BLogic.EzAdmin.GraphQL.QueryProcessor.processQuery body token
        match result with 
            | Some r -> return! okWithJson r next ctx
            | None -> return! okWithStr "" next ctx

    }