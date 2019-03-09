namespace BLogic.EzAdmin.Core.Services.SqlTypes

open BLogic.EzAdmin.Data.Repositories.SqlTypes.SqlTypeRepository
open BLogic.EzAdmin.Data.Repositories.SqlTypes.SqlReferenceRepository

module SqlTypeService = 
    let getAllSchemas = getAllSchemas

    let getTable = getTable

    let getTables = getTables

    let getColumns = getColumns

    let getReferencesToTable = getReferencesToTable

    let getReferencesFromTable = getReferencesFromTable

