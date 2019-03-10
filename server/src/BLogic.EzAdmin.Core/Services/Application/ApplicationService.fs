namespace BLogic.EzAdmin.Core.Services.Application

open MongoDB.Driver

module ApplicationService =
    open BLogic.EzAdmin.Domain.GraphQL
    open BLogic.EzAdmin.Domain.SchemaTypes
    open BLogic.EzAdmin.Core.Engines
    open BLogic.EzAdmin.Data.Repositories.Schemas
    open MongoDB.Bson
    open BLogic.EzAdmin.Domain.UiTypes

    let getApp id offset limit = 
        let app = SchemaTypesRepository.getByID id
        match app.Pages with 
            | head::_ -> Engine.getApp offset limit head app.Connection (app.MenuItems |> List.map (fun e -> {Name = e.Name; Rank = e.Rank; PageID = e.PageID.ToString()}))
            | [] -> {Pages = List.empty; MenuItems = List.empty; Connection = app.Connection}

    let getAppWithPage appID (pageID: string) offset limit = 
        let app = SchemaTypesRepository.getByID appID
        let page = (app.Pages |> Seq.find(fun e -> e.PageID = ObjectId(pageID)))
        Engine.getApp offset limit page app.Connection (app.MenuItems |> List.map (fun e -> {Name = e.Name; Rank = e.Rank; PageID = e.PageID.ToString()})) |> Some

    let saveView (input: AppInput) id = 
        let app = SchemaTypesRepository.getByID id
        let rank = match app.MenuItems with 
                    | head::tail -> (head::tail) |> Seq.maxBy (fun e -> e.Rank) |> (fun a -> a.Rank + 10)
                    | [] -> 10

        let page = { PageID = ObjectId.GenerateNewId();
                    Name = input.tableTitle;
                    Table = AppInputTransformer.tranformToSchema input }
        let menuItem = {MenuItemID = ObjectId.GenerateNewId(); Name = input.tableTitle; Rank = rank; PageID = page.PageID}

        let updateDefinition = 
            Builders<AppSchema>.Update
                                .Set((fun x -> x.MenuItems), app.MenuItems @ [menuItem])
                                .Set((fun x -> x.Pages), app.Pages @ [page])

        SchemaTypesRepository.update id updateDefinition |> ignore
        id

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
        let apps = SchemaTypesRepository.getByUserID userID |> Seq.map (fun e -> {AppID = e.AppID.ToString(); Name = e.Name; Connection = e.Connection}) |> Seq.toList
        apps

    let getUserApp appID= 
        let app = SchemaTypesRepository.getByID appID

        {AppID = app.AppID.ToString(); Name = app.Name; Connection = app.Connection}
