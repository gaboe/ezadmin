namespace BLogic.EzAdmin.Core.Services.Application

module ApplicationService =
    open BLogic.EzAdmin.Domain.GraphQL
    open BLogic.EzAdmin.Domain.SchemaTypes
    open BLogic.EzAdmin.Core.Engines
    open BLogic.EzAdmin.Data.Repositories.Schemas
    open MongoDB.Bson
    open BLogic.EzAdmin.Domain.UiTypes

    let getApp id: App= 
        let app = SchemaTypesRepository.getByID id
        let table = app.Pages.Head.Table
        Engine.getApp table

    let saveView (input: AppInput) = 
        let app: AppSchema = { 
                                AppID = ObjectId.GenerateNewId()
                                MenuItems = [{MenuItemID = ObjectId.GenerateNewId(); Name = input.tableTitle; Rank = 0}];
                                Pages = [
                                    { PageID = ObjectId.GenerateNewId();
                                    Name = input.tableTitle;
                                    Table = AppInputTransformer.tranformToSchema input }]}
                                |> SchemaTypesRepository.createApp

        app.AppID.ToString()

    

