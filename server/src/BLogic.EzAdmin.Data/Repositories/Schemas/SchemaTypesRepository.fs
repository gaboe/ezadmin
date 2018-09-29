namespace BLogic.EzAdmin.Data.Repositories.Schemas

open BLogic.EzAdmin.Domain.SchemaTypes
open BLogic.EzAdmin.Data.Core.MongoHandler
open MongoDB.Driver

module SchemaTypesRepository =

    let createApp (app : App ) = 
            appCollection().InsertOne(app)
            app

    let readAll() =
            appCollection().Find(Builders.Filter.Empty).ToEnumerable()