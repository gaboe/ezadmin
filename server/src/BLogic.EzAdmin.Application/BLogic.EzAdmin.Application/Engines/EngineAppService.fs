namespace BLogic.EzAdmin.Application.Engines

open BLogic.EzAdmin.Core.Services.Security.TokenService
open BLogic.EzAdmin.Core.Services.Application
open BLogic.EzAdmin.Core.Services.Schemas
open BLogic.EzAdmin.Core.Engines
open MongoDB.Bson

module EngineAppService = 
    let getAppPreview token input =
        let preview = TokenService.withApp token (fun app -> Engine.getAppPreview input app |> Some)
        preview
    
    let getApp = ApplicationService.getApp

    let getAppWithPage = ApplicationService.getAppWithPage

    let deleteRecord appID pageID recordKey = 
        let app = SchemaTypeService.getApp appID
        let page = app.Pages |> Seq.find (fun e -> e.PageID = ObjectId.Parse(pageID))
        let result = Engine.deleteRecord app.Connection page.Table recordKey
        result


