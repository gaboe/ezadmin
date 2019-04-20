namespace BLogic.EzAdmin.Data.Engines

open BLogic.EzAdmin.Domain.SchemaTypes
open BLogic.EzAdmin.Data

module EngineCommands =
    let deleteEntity connection (description: QueryDescription) entityID =
        
        let mainTable = sprintf "%s.%s" description.MainTable.SchemaName description.MainTable.TableName

        let primaryKey = description.MainTable.Columns |> Seq.find (fun e -> e.Column.ColumnType = ColumnType.PrimaryKey)
        
        let query = sprintf "DELETE FROM %s WHERE %s = %s" mainTable primaryKey.Column.ColumnName entityID

        let execute () = 
            QueryHandler.execute {
                                                       Query = query;
                                                       Parameters = List.empty;
                                                       Connection = connection
                                                       }
                                 |> Async.RunSynchronously

        let result = try execute() |> Result.Ok 
                      with
                      | Failure msg -> Result.Error msg
        result                        
                    

        
