namespace BLogic.EzAdmin.GraphQL

module QueryProcessor = 
    open BLogic.EzAdmin.Domain.GraphQL
    open Newtonsoft.Json
    open BLogic.EzAdmin.Core.Converters.OptionConverter
    open BLogic.EzAdmin.Core.Converters.InputTypeConverter
    open BLogic.EzAdmin.Core.Utils
    open FSharp.Data.GraphQL.Execution
    open Newtonsoft.Json.Converters

    let removeSpacesAndNewLines (str : string) = str.Trim().Replace("\r\n", " ")

    let getOptionString str = 
        if System.String.IsNullOrEmpty(str)
                        then None
                        else Some str

    let processQuery (body:UnsafeGraphQlQuery) =
        let jsonSettings =
                JsonSerializerSettings()
                |> tee (fun s ->
                    s.Converters <- [| OptionConverter() :> JsonConverter; DiscriminatedUnionConverter() :> JsonConverter |]
                    s.ContractResolver <- Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver())
  
        let getResultData =
                function
                | Direct (data, _) ->
                    Some data
                | Deferred (data, _, deferred) ->
                    deferred |> Observable.add(fun d -> printfn "Deferred: %s" (JsonConvert.SerializeObject(d, jsonSettings)))
                    Some data
                | Stream _ ->
                    None

        let gqlQuery = getOptionString body.Query

        let tryConvertToInput (jObject: obj) =
            match jObject with
                    | :? string -> jObject
                    | _ -> JsonConvert.SerializeObject(jObject, jsonSettings) |> convertToInput

        let variables = match System.Object.ReferenceEquals(body.Variables, null) with
                            | true -> None
                            | false -> body.Variables 
                                        |> Seq.map (fun (KeyValue(k,v)) -> k, tryConvertToInput v) 
                                        |> Map.ofSeq 
                                        |> Some

        let result  = match gqlQuery, variables with
                            | Some query, Some variables ->
                                let query = query |> removeSpacesAndNewLines
                                let result = GraphQLSchema.executor.AsyncExecute(query, variables = variables, data = GraphQLSchema.root) |> Async.RunSynchronously
                                result
                            | Some query, None ->
                                let query = query |> removeSpacesAndNewLines
                                let result = GraphQLSchema.executor.AsyncExecute(query) |> Async.RunSynchronously
                                result
                            | None, _ ->
                                let result = GraphQLSchema.executor.AsyncExecute(FSharp.Data.GraphQL.Introspection.introspectionQuery) |> Async.RunSynchronously
                                result
            
        getResultData result

        
