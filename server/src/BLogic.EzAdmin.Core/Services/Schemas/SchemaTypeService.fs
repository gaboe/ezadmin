namespace BLogic.EzAdmin.Core.Services.Schemas

open BLogic.EzAdmin.Data.Repositories.Schemas
module SchemaTypeService = 
    let getApp id = SchemaTypesRepository.getByID id 

