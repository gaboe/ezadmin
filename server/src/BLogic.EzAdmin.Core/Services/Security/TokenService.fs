namespace BLogic.EzAdmin.Core.Services.Security.TokenService
open BLogic.EzAdmin.Core.Services.Users
open BLogic.EzAdmin.Core.Services.Application
open BLogic.EzAdmin.Core.Services.Schemas

module TokenService = 
    open JWT.Builder
    open JWT.Algorithms
    open System
    open Newtonsoft.Json
    open BLogic.EzAdmin.Core.Converters

    let private secret = "14we6465asd32ad1s32as1d32as1d3298d1as1dqwe";

    type Token = {exp: int; userID: string; email: string; appID: string option}

    
    let validate token =
        try
            let json = JwtBuilder().WithSecret(secret).MustVerifySignature().Decode(token)
            Result.Ok json
        with 
            | ex -> Result.Error <| string ex
    
    let isValid token = match validate token with | Ok _ -> true | Error _ -> false
    
    let deserializeValue value = JsonConvert.DeserializeObject<Token>(value, Settings.jsonSettings)

    let getJwtToken token = token |> Option.bind (fun t -> match validate t with
                                                            | Ok e -> 
                                                                      deserializeValue e |> Some
                                                            | Error _ -> None)

    let createToken name pass =
        match UserService.getUser name pass with 
                | Some user -> 
                                            let tokenBuilder = JwtBuilder()
                                                                .WithAlgorithm(new HMACSHA256Algorithm())
                                                                .WithSecret(secret)
                                                                .AddClaim("exp", DateTimeOffset.UtcNow.AddHours(float 1).ToUnixTimeSeconds())
                                                                .AddClaim("userID", user.UserID)
                                                                .AddClaim("email", user.Email)
                                                                .AddClaim("appID", None)

                                            let token = tokenBuilder.Build()
                                            Ok token
                | None -> Error "Invalid credentials"
    
    let setAppID token (appID: string) = getJwtToken token
                                            |> Option.bind (fun jwtToken -> let tokenBuilder = JwtBuilder()
                                                                                                .WithAlgorithm(new HMACSHA256Algorithm())
                                                                                                .WithSecret(secret)
                                                                                                .AddClaim("exp", jwtToken.exp)
                                                                                                .AddClaim("userID", jwtToken.userID)
                                                                                                .AddClaim("email", jwtToken.email)
                                                                                                .AddClaim("appID", Some appID)
                                                                            
                                                                            let token = tokenBuilder.Build()
                                                                            Some token)
        
    let getUserID token = token |> getJwtToken |> Option.bind (fun jwtToken -> Some jwtToken.userID)

    let getAppID token = token |> getJwtToken |> Option.bind (fun jwtToken -> jwtToken.appID)

    let withUserApp token fn = getAppID token |> Option.bind (fun appID -> ApplicationService.getUserApp appID |> fn)

    let withApp token fn = getAppID token |> Option.bind (fun appID -> ApplicationService.getApp appID 0 10 |> fn)

    let withAppSchema token fn = getAppID token |> Option.bind (fun appID -> SchemaTypeService.getApp appID |> fn)

    let withUser token fn = getUserID token |> Option.bind (fun userID -> UserService.getUser userID |> fn)


        



