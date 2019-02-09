namespace BLogic.EzAdmin.Api


module HttpHandlers =

    open Microsoft.AspNetCore.Http
    open FSharp.Control.Tasks.V2.ContextInsensitive
    open Giraffe
    open BLogic.EzAdmin.Api.Models
    open Newtonsoft.Json
    open FSharp.Data.GraphQL.Samples.GiraffeServer
    open FSharp.Data.GraphQL.Execution
    open System.Text
    open System.IO
    open BLogic.EzAdmin.GraphQL
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
    
    let graphiQL (next : HttpFunc) (ctx : HttpContext) = task {
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
       //let jsonSettings =
       //     JsonSerializerSettings()
       //     |> tee (fun s ->
       //         s.Converters <- [| OptionConverter() :> JsonConverter |]
       //         s.ContractResolver <- Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver())
       // let json =
       //     function
       //     | Direct (data, _) ->
       //         JsonConvert.SerializeObject(data, jsonSettings)
       //     | Deferred (data, _, deferred) ->
       //         deferred |> Observable.add(fun d -> printfn "Deferred: %s" (JsonConvert.SerializeObject(d, jsonSettings)))
       //         JsonConvert.SerializeObject(data, jsonSettings)
       //     | Stream _ ->
       //         "{}"
       // let tryParse fieldName (data: byte[]) =
       //     let raw = Encoding.UTF8.GetString data
       //     if System.String.IsNullOrWhiteSpace(raw) |> not
       //     then
       //         let map = JsonConvert.DeserializeObject<Map<string,string>>(raw)
       //         match Map.tryFind fieldName map with
       //         | Some "" -> None
       //         | s -> s
       //     else None
       // let mapString =
       //     JsonConvert.DeserializeObject<Map<string, obj>>
       //     |> Option.map
       // let removeSpacesAndNewLines (str : string) = 
       //     str.Trim().Replace("\r\n", " ")
       // let readStream (s : Stream) =
       //     use ms = new MemoryStream(4096)
       //     s.CopyTo(ms)
       //     ms.ToArray()
       // let body = readStream ctx.Request.Body
       // let query = body |> tryParse "query"
       // let variables = body |> tryParse "variables" |> mapString
       // match query, variables  with
       // | Some query, Some variables ->
       //     printfn "Received query: %s" query
       //     printfn "Received variables: %A" variables
       //     let query = query |> removeSpacesAndNewLines
       //     let result = Schema.executor.AsyncExecute(query, variables = variables, data = Schema.root) |> Async.RunSynchronously
       //     printfn "Result metadata: %A" result.Metadata
       //     return! okWithStr (json result) next ctx
       // | Some query, None ->
       //     printfn "Received query: %s" query
       //     let query = query |> removeSpacesAndNewLines
       //     let result = Schema.executor.AsyncExecute(query) |> Async.RunSynchronously
       //     printfn "Result metadata: %A" result.Metadata
       //     return! okWithStr (json result) next ctx
       // | None, _ ->
       //     let result = Schema.executor.AsyncExecute(FSharp.Data.GraphQL.Introspection.introspectionQuery) |> Async.RunSynchronously
       //     printfn "Result metadata: %A" result.Metadata
       //     return! okWithStr (json result) next ctx
    }