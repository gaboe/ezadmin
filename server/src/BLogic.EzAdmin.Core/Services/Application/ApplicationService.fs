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
        Engine.getApp app.Pages.Head

    let saveView (input: AppInput) = 
        let app: AppSchema = { 
                                AppID = ObjectId.GenerateNewId();
                                UserID = ObjectId.GenerateNewId();
                                Name = "";
                                Connection = "";
                                MenuItems = [{MenuItemID = ObjectId.GenerateNewId(); Name = input.tableTitle; Rank = 0}];
                                Pages = [
                                    { PageID = ObjectId.GenerateNewId();
                                      Name = input.tableTitle;
                                      Table = AppInputTransformer.tranformToSchema input }]}
                                |> SchemaTypesRepository.createApp

        app.AppID.ToString()

    let createApplication name connection userID = 
        let app: AppSchema = { 
                                AppID = ObjectId.GenerateNewId();
                                UserID = userID;
                                Name = name;
                                Connection = connection;
                                MenuItems = [];
                                Pages = [];}
                                |> SchemaTypesRepository.createApp
        app

    let getApps userID = 
        let apps = SchemaTypesRepository.getByUserID userID |> Seq.map (fun e -> {Name = e.Name; Connection = e.Connection}) |> Seq.toList
        apps