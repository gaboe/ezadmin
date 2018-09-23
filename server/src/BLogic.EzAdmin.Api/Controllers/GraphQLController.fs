namespace BLogic.EzAdmin.Api.Controllers
open Microsoft.AspNetCore.Mvc
open BLogic.EzAdmin.Domain.GraphQL
open BLogic.EzAdmin.GraphQL.QueryProcessor

[<Route("[controller]")>]
[<ApiController>]
type GraphQlController () =
    inherit ControllerBase()

    [<HttpPost>]
    member __.Post([<FromBody>] body: UnsafeGraphQlQuery) = 
            processQuery body
        
