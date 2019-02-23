namespace BLogic.EzAdmin.Core.Services.SqlTypes

open BLogic.EzAdmin.Data.Repositories.SqlTypes.SqlTypeRepository
open BLogic.EzAdmin.Data.Repositories.SqlTypes.SqlReferenceRepository

module SqlTypeService = 
    let getAllSchemas = getAllSchemas

    let getTable (schemaName, tableName) = getTable schemaName tableName

    let getTables schemaName = getTables schemaName

    let getColumns tableName = getColumns tableName

    let getReferencesToTable tableName = getReferencesToTable tableName

    let getReferencesFromTable tableName = getReferencesFromTable tableName

