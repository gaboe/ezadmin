module DefineExtensions

open FSharp.Data.GraphQL.Types
open System

    type Define with 
        static member AuthorizedField(name : string,
                                      typedef : #OutputDef<'Res>,
                                      description : string,
                                      resolve) : FieldDef<'Val> = 

            Define.Field(name, typedef, description, fun ctx root -> match 4 with | 4 -> raise (Exception("AUTHORISATION_ERROR")) | _ -> resolve ctx root)
    

