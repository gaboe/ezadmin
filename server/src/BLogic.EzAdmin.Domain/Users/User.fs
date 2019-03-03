namespace BLogic.EzAdmin.Domain.Users

open MongoDB.Bson
open MongoDB.Bson.Serialization.Attributes

type [<CLIMutable>]User = {[<BsonId>]UserID: ObjectId;
                            Email: string;
                            Password: string}
