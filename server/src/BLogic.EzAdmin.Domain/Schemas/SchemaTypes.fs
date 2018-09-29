namespace BLogic.EzAdmin.Domain.SchemaTypes

open MongoDB.Bson

type [<CLIMutable>] App = 
            {[<DefaultValue>] Id : BsonObjectId;
            Name : string;} 

