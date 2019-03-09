namespace BLogic.EzAdmin.Application.SqlTypes

open BLogic.EzAdmin.Core.Services.Security.TokenService
open BLogic.EzAdmin.Core.Services.Application
open BLogic.EzAdmin.Core.Services.SqlTypes

module SqlTypesAppService = 

    let private itemsOrEmptyList token fn = 
                let maybeItems = TokenService.withUserApp token (fun app -> fn app |> Async.RunSynchronously |> Array.toList |> Some)
                match maybeItems with 
                    | Some items -> items
                    | None -> List.empty

    let getAllSchemas token = itemsOrEmptyList token (fun app -> SqlTypeService.getAllSchemas app.Connection)
    
    let getTables token schemaName = itemsOrEmptyList token (fun app -> SqlTypeService.getTables schemaName app.Connection)
    
    let getColumns token tableName = itemsOrEmptyList token (fun app -> SqlTypeService.getColumns tableName app.Connection)

    let getReferencesToTable token tableName = itemsOrEmptyList token (fun app -> SqlTypeService.getReferencesToTable tableName app.Connection)

    let getReferencesFromTable token tableName = itemsOrEmptyList token (fun app -> SqlTypeService.getReferencesFromTable tableName app.Connection)

    let getTable token schemaName tableName =
        TokenService.withUserApp token (fun app -> SqlTypeService.getTable schemaName tableName app.Connection |> Async.RunSynchronously)

