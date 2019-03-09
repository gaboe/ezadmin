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

    let getByUserID userID =
            appCollection().Find(fun e -> e.UserID = userID).ToList()

    let update id definiton =
            let _id = ObjectId.Parse(id)
            appCollection().UpdateOne(Builders.Filter.Eq((fun x -> x.AppID), _id), definiton)