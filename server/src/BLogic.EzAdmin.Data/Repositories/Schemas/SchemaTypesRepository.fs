namespace BLogic.EzAdmin.Data.Repositories.Schemas

open BLogic.EzAdmin.Domain.SchemaTypes
open BLogic.EzAdmin.Data.Core.MongoHandler
open MongoDB.Driver

module SchemaTypesRepository =
    open System.Linq
    open MongoDB.Bson

    let createApp (app : AppSchema ) = 
            appCollection().InsertOne(app)
            app

    let readAll() =
            appCollection().Find(Builders.Filter.Empty).ToEnumerable()

    let getByID id =
            let _id = ObjectId.Parse(id)
            appCollection().Find(fun e -> e.AppID = _id).Single()