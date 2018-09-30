namespace BLogic.EzAdmin.GraphQL
type TestInput = {a: string}

type TestInput2 = { b: int }

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
    
    type Input = string
    type ConversionResult = ConvertedInput of obj * Input | Nothing of Input

    let tryConvert<'a> input = 
        try
                let result = JsonConvert.DeserializeObject<'a>(input, jsonSettings)
                ConvertedInput (result, input)
        with
                _ -> Nothing input

    let convert<'a>(previousResult: ConversionResult) = 
        match previousResult with 
            | ConvertedInput _ -> (previousResult)
            | Nothing input -> (tryConvert<'a> input)
        
    
    let convertInput input =
        let e = convert<TestInput>(input |> ConversionResult.Nothing) 
                |> convert<TestInput2>

        match e with 
            | ConvertedInput (x,_) -> x 
            | Nothing _ -> box ""
        

