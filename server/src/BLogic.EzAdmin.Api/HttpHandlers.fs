namespace BLogic.EzAdmin.Api


module HttpHandlers =

    open Microsoft.AspNetCore.Http
    open FSharp.Control.Tasks.V2.ContextInsensitive
    open Giraffe
    open BLogic.EzAdmin.Domain.GraphQL
    open System.IO
    open System.Text
    open Newtonsoft.Json

    let okWithJson x : HttpHandler = setStatusCode 200 >=> json x

    let badRequest : HttpHandler = setStatusCode 400 >=> text "Bad request"
    
    let getToken (ctx : HttpContext) = 
        ctx.Request.Headers 
                        |> Seq.tryFind (fun k -> k.Key = "Authorization")
                        |> Option.bind (fun header -> header.Value 
                                                        |> Seq.tryItem 0 
                                                        |> Option.bind (fun t -> t.Replace("Bearer ","") |> Some))
    let readStream (s : Stream) =
        use ms = new MemoryStream(4096)
        s.CopyTo(ms)
        ms.ToArray()
    
    let graphql (next : HttpFunc) (ctx : HttpContext) = task {
        let token = getToken ctx
            
        let body = readStream ctx.Request.Body |> Encoding.UTF8.GetString |> JsonConvert.DeserializeObject<UnsafeGraphQlQuery>
        
        let result = BLogic.EzAdmin.GraphQL.QueryProcessor.processQuery body token
     
        match result with 
            | Some r -> return! okWithJson r next ctx
            | None -> return! badRequest next ctx
    }