namespace BLogic.EzAdmin.Core.Services.SqlTypes

open BLogic.EzAdmin.Data.Repositories.SqlTypes.SqlTypeRepository

module SqlTypeService = 
    let getAllSchemas = getAllSchemas

    let getTable tableName = getTable tableName

    let getTables schemaName = getTables schemaName

