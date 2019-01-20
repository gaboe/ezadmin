﻿namespace BLogic.EzAdmin.Core.Service.Security.TokenService

module TokenService = 
    open JWT.Builder
    open JWT.Algorithms
    open System

    let secret = "14we6465asd32ad1s32as1d32as1d3298d1as1dqwe";

    let validate token =
        try
            let json = JwtBuilder().WithSecret(secret).MustVerifySignature().Decode(token)
            Result.Ok json
        with 
            | ex -> Result.Error <| string ex
    
    let isValid token = match validate token with | Ok _ -> true | Error _ -> false
    
    let createToken name pass =
        let tokenBuilder = JwtBuilder()
                            .WithAlgorithm(new HMACSHA256Algorithm())
                            .WithSecret(secret)
                            .AddClaim("exp", DateTimeOffset.UtcNow.AddHours(float 1).ToUnixTimeSeconds())
                            .AddClaim("auth", name)

        let token = tokenBuilder.Build()
        token
