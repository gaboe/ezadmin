namespace BLogic.EzAdmin.Core.Services.Application

module ApplicationService =
    open BLogic.EzAdmin.Domain.GraphQL
    open BLogic.EzAdmin.Domain.SchemaTypes
    open BLogic.EzAdmin.Core.Engines
    open BLogic.EzAdmin.Data.Repositories.Schemas
    open Newtonsoft.Json.Bson
    open System
    open MongoDB.Bson
    open MongoDB.Bson.Serialization.IdGenerators

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

    

