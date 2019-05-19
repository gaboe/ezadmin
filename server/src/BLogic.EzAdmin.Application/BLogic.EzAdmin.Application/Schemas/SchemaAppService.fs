namespace BLogic.EzAdmin.Application.Schemas

open BLogic.EzAdmin.Core.Services.Security.TokenService
open BLogic.EzAdmin.Core.Services.Application
module SchemaAppService = 
    let saveView token appInput = 
        TokenService.getAppID token |> Option.bind (fun appID -> ApplicationService.saveView appInput appID |> string |> Some)

