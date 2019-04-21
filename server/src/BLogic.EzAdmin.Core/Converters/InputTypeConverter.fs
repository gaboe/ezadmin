namespace BLogic.EzAdmin.Core.Converters

open BLogic.EzAdmin.Core.Utils
open BLogic.EzAdmin.Domain.GraphQL
open Newtonsoft.Json

module InputTypeConverter = 
    let strictJsonSettings =
                JsonSerializerSettings()
                |> tee (fun s ->
                    s.Converters <- [| OptionConverter.OptionConverter2() :> JsonConverter;|]
                    s.MissingMemberHandling <- MissingMemberHandling.Error
                    s.ContractResolver <- Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver())
    
    type Input = string
    type ConversionResult = ConvertedInput of obj * Input | Nothing of Input

    let tryConvert<'a> input = 
        try
                let result = JsonConvert.DeserializeObject<'a>(input, strictJsonSettings)
                ConvertedInput (result, input)
        with
                _ -> Nothing input

    let convert<'a>(previousResult: ConversionResult) = 
        match previousResult with 
            | ConvertedInput _ -> (previousResult)
            | Nothing input -> (tryConvert<'a> input)
        
    
    let convertToInput input =
        let result = convert<AppInput>(input |> ConversionResult.Nothing) 
                    |> convert<ColumnInput>
                    |> convert<ChangedColumn>
                    |> convert<UpdateEntityInput>

        match result with 
            | ConvertedInput (object,_) -> object 
            | Nothing _ -> box input