namespace BLogic.EzAdmin.GraphQL
type TestInput = {a: string}

    //type TestInput with 
    //    static member FromJson (_: TestInput) = Chiron.Builder.json{
    //        let! n = Chiron.Mapping.Json.read "a"       
    //        return { a = n }
    //    }
type TestInput2 = { b: int }

    //type TestInput2 with 
    //    static member FromJson (_: TestInput2) = Chiron.Builder.json{
    //        let! n = Chiron.Mapping.Json.read "b"       
    //        return { a = n }
    //    }

type TestInputs = TestInput | TestInput2

module InputTypeConverter = 
    open Newtonsoft.Json

    let tee f x =
        f x
        x

    let jsonSettings =
                JsonSerializerSettings()
                |> tee (fun s ->
                    s.MissingMemberHandling <- MissingMemberHandling.Error
                    s.ContractResolver <- Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver())
    
    type ConversionResult = ConvertedInput of obj * string | Nothing of string

    let tc<'a> input = 
        try
                let e = JsonConvert.DeserializeObject<'a>(input, jsonSettings)
                ConvertedInput (e, input)
        with
                _ -> Nothing input

    let tryConvert<'a>(previousResult: ConversionResult) = 
        match previousResult with 
            | ConvertedInput _ -> (previousResult)
            | Nothing input -> (tc<'a> input)
        
    
    let convertInput input =
        let e = tryConvert<TestInput>(input |> ConversionResult.Nothing) 
                |> tryConvert<TestInput2>

        let o = match e with 
                | ConvertedInput (x,_) -> x
                | Nothing _ -> box ""
        //let result = cases |> Seq.find (fun e -> tryConvert (e, input))

        o
        

