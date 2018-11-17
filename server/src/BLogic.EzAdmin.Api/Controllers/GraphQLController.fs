namespace BLogic.EzAdmin.Api.Controllers

open Microsoft.AspNetCore.Mvc
open BLogic.EzAdmin.Domain.GraphQL
open BLogic.EzAdmin.GraphQL.QueryProcessor
open Microsoft.AspNetCore.Http
open JWT
open JWT.Algorithms
open JWT.Serializers
open JWT.Builder
open System


    
    type LoginDetails = {
      email: string;
      password: string;
    }

    type Login = {
      user: LoginDetails;
    }


[<Route("[controller]")>]
[<ApiController>]
type GraphQlController () =
    inherit ControllerBase()

    [<HttpPost>]
    member __.Post([<FromBody>] body: UnsafeGraphQlQuery) = 
            //let secret = "GQDstcKsx0NHjPOuXOYg5MbeJ1XT0uFiwDVvVBrk";

            //let validate token =
            //    try
            //        let json = JwtBuilder().WithSecret(secret).MustVerifySignature().Decode(token)
            //        Result.Ok json
            //    with 
            //        | ex -> Result.Error <| string ex

            //let createToken =
            //    let token = JwtBuilder()
            //                      .WithAlgorithm(new HMACSHA256Algorithm())
            //                      .WithSecret(secret)
            //                      .AddClaim("exp", DateTimeOffset.UtcNow.AddHours(float 1).ToUnixTimeSeconds())
            //                      .AddClaim("auth", "AUTHORIZED")
            //                      .Build();
            //    token
            
            //let useToken (ctx: HttpContext) f =
            //    match ctx.Request.Headers |> Seq.tryFind (fun k -> k.Key = "Authorization") with
            //    | Some accesstoken -> 
            //        let jwt = accesstoken.Value.[0].Replace("Token ","")
            //        match validate jwt with
            //                    | Ok json -> f json |> JsonResult
            //                    | Error error -> JsonResult <| error
            //    | _ -> f "" |> JsonResult //JsonResult "Request doesn't contain a JSON Web Token"
            

            //let t = createToken
            //let ctx = 

            //let r = useToken c (fun t -> 
            //                    let result = processQuery body 
            //                    match result with 
            //                                | Some r -> JsonResult(r)
            //                                | None -> JsonResult("")
            //    )

            let token = __.HttpContext.Request.Headers 
                        |> Seq.tryFind (fun k -> k.Key = "Authorization")
                        |> Option.bind (fun header -> header.Value 
                                                        |> Seq.tryItem 0 
                                                        |> Option.bind (fun t -> t.Replace("Bearer ","") |> Some))

            let result = processQuery body token
            match result with 
                | Some r -> JsonResult(r)
                | None -> JsonResult("")            
            
        
