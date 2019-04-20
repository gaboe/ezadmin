namespace BLogic.EzAdmin.Application.Engines

open BLogic.EzAdmin.Core.Services.Security.TokenService
open BLogic.EzAdmin.Core.Services.Application
open BLogic.EzAdmin.Core.Services.Schemas
open BLogic.EzAdmin.Core.Engines
open MongoDB.Bson
open BLogic.EzAdmin.Domain.SchemaTypes
open BLogic.EzAdmin.Domain.UiTypes

module EngineAppService = 
    let getAppPreview token input =
        let preview = TokenService.withApp token (fun app -> Engine.getAppPreview input app |> Some)
        preview
    
    let getApp = ApplicationService.getApp

    let getAppWithPage = ApplicationService.getAppWithPage

    let private getPage pageID (app: AppSchema) = 
        app.Pages |> Seq.find (fun e -> e.PageID = ObjectId.Parse(pageID))

    let getEntity token pageID entityID = 
        let entity = TokenService.withAppSchema token (fun app ->   let page = getPage pageID app
                                                                    Engine.getEntity app.Connection page.Table entityID 
                                                                    |> (fun e -> {Row = e}) 
                                                                    |> Some)
        entity                                                               

    let deleteEntity appID pageID entityID = 
        let app = SchemaTypeService.getApp appID
        let page = getPage pageID app
        let result = Engine.deleteEntity app.Connection page.Table entityID
        result


