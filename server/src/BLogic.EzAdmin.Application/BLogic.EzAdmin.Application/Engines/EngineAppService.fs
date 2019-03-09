namespace BLogic.EzAdmin.Application.Engines

open BLogic.EzAdmin.Core.Services.Security.TokenService
open BLogic.EzAdmin.Core.Services.Application
open BLogic.EzAdmin.Core.Engines

module EngineAppService = 
    let getAppPreview token input =
        let preview = TokenService.withApp token (fun app -> Engine.getAppPreview input app |> Some)
        preview
    
    let getApp = ApplicationService.getApp


