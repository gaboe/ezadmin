namespace BLogic.EzAdmin.Data.Repositories.Users
open BLogic.EzAdmin.Data.Core
open BLogic.EzAdmin.Domain.Users

module UserRepository =
    open System.Linq
    open MongoDB.Driver
    open MongoDB.Bson

    let createUser email password = 
        let user: User = {UserID = ObjectId.GenerateNewId(); Email = email; Password = password}
        MongoHandler.userCollection().InsertOne(user)
        user

    let getUser email password = 
        let user = MongoHandler.userCollection().Find(fun e -> e.Email = email && e.Password = password).SingleOrDefault()
        match System.Object.ReferenceEquals(user, null) with
                        | true -> None
                        | false -> Some user
        
            