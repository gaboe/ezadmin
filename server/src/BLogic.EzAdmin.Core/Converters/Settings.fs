namespace BLogic.EzAdmin.Core.Converters

module Settings = 
    open Newtonsoft.Json
    open Newtonsoft.Json.Converters
    open BLogic.EzAdmin.Core.Converters.OptionConverter

    let jsonSettings = JsonSerializerSettings()
                        |> BLogic.EzAdmin.Core.Utils.tee (fun s ->
                            s.Converters <- [| OptionConverter() :> JsonConverter; DiscriminatedUnionConverter() :> JsonConverter |]
                            s.ContractResolver <- Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver())    

