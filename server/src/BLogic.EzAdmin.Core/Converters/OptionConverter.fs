namespace BLogic.EzAdmin.Core.Converters

module OptionConverter = 
    open Newtonsoft.Json
    open Microsoft.FSharp.Reflection
    open Microsoft.FSharp.Core.Operators
    open System

    type OptionConverter() =
            inherit JsonConverter()
    
            override __.CanConvert(t) = 
            
                t.GetType().IsGenericType && t.GetGenericTypeDefinition() = typedefof<option<_>>

            override __.WriteJson(writer, value, serializer) =
                let getFields value =
                    let _, fields = FSharpValue.GetUnionFields(value, value.GetType())
                    fields.[0]
                let value = 
                    match value with
                    | null ->null
                    | _ -> getFields value
                serializer.Serialize(writer, value)

            override __.ReadJson(_, _, _, _) = failwith "Not supported"

    type OptionConverter2() =
        inherit JsonConverter()

        override x.CanConvert(t) = 
            t.IsGenericType && t.GetGenericTypeDefinition() = typedefof<option<_>>

        override x.WriteJson(writer, value, serializer) =
            let value = 
                if value = null then null
                else 
                    let _,fields = FSharpValue.GetUnionFields(value, value.GetType())
                    fields.[0]  
            serializer.Serialize(writer, value)

        override x.ReadJson(reader, t, existingValue, serializer) =        
            let innerType = t.GetGenericArguments().[0]
            let innerType = 
                if innerType.IsValueType then (Microsoft.FSharp.Core.Operators.typedefof<Nullable<_>>).MakeGenericType([|innerType|])            else innerType        
            let value = serializer.Deserialize(reader, innerType)
            let cases = FSharpType.GetUnionCases(t)
            if value = null then FSharpValue.MakeUnion(cases.[0], [||])
            else FSharpValue.MakeUnion(cases.[1], [|value|])

