namespace BLogic.EzAdmin.Core.Services.Security.TokenService
open BLogic.EzAdmin.Core.Services.Users

module TokenService = 
    open JWT.Builder
    open JWT.Algorithms
    open System
    open Newtonsoft.Json

    let private secret = "14we6465asd32ad1s32as1d32as1d3298d1as1dqwe";
    type Token = {exp: int; userID: string; email: string}

    let validate token =
        try
            let json = JwtBuilder().WithSecret(secret).MustVerifySignature().Decode(token)
            Result.Ok json
        with 
            | ex -> Result.Error <| string ex
    
    let isValid token = match validate token with | Ok _ -> true | Error _ -> false
    
    let createToken name pass =
        UserService.getUser name pass 
                |> Option.bind (fun user -> 
                                            let tokenBuilder = JwtBuilder()
                                                                .WithAlgorithm(new HMACSHA256Algorithm())
                                                                .WithSecret(secret)
                                                                .AddClaim("exp", DateTimeOffset.UtcNow.AddHours(float 1).ToUnixTimeSeconds())
                                                                .AddClaim("userID", user.UserID)
                                                                .AddClaim("email", user.Email)

                                            let token = tokenBuilder.Build()
                                            Some token
        
        )
    let deserializeValue value = JsonConvert.DeserializeObject<Token>(value)

    let getUserID token = token |> Option.bind (fun t -> match validate t with
                                                            | Ok e -> 
                                                                      let jwtToken = deserializeValue e
                                                                      Some jwtToken.userID  
                                                            | Error _ -> None)
        



