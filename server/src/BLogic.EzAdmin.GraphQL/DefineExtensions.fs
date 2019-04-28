module DefineExtensions

open BLogic.EzAdmin.Core.Services.Security.TokenService
open BLogic.EzAdmin.Domain.GraphQL
open FSharp.Data.GraphQL.Types
open System

    let isAuthorized root = 
        match root.Token with 
            | Some t -> TokenService.isValid t
            | None -> false

        type Define with 
        static member AuthorizedField(name : string,
                                      typedef : #OutputDef<'Res>,
                                      description : string,
                                      resolve) : FieldDef<Root> = 

            Define.Field(name, typedef, description, 
                            fun ctx root -> match isAuthorized root with
                                                    | true -> resolve ctx root
                                                    | false -> raise (Exception("AUTHORIZATION_ERROR"))) 
    
        static member AuthorizedField(name : string,
                                             typedef : #OutputDef<'Res>,
                                             description : string,
                                             args : InputFieldDef list, 
                                             resolve) : FieldDef<Root> = 

                   Define.Field(name, typedef, description, args,
                                   fun ctx root -> match isAuthorized root with
                                                           | true -> resolve ctx root
                                                           | false -> raise (Exception("AUTHORIZATION_ERROR"))) 
    

