namespace BLogic.EzAdmin.Data.Repositories.Schemas

open BLogic.EzAdmin.Domain.SchemaTypes
open BLogic.EzAdmin.Data.Core.MongoHandler
open MongoDB.Driver

module SchemaTypesRepository =
    open System.Linq

    let createApp (app : AppSchema ) = 
            appCollection().InsertOne(app)
            let e = appCollection().Find(FilterDefinition.Empty).First()
            app

    let readAll() =
            appCollection().Find(Builders.Filter.Empty).ToEnumerable()