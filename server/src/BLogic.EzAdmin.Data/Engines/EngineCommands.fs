namespace BLogic.EzAdmin.Data.Engines

open BLogic.EzAdmin.Domain.SchemaTypes
open BLogic.EzAdmin.Data

module EngineCommands =
    type SB = System.Text.StringBuilder

    let tryExecute connection query = 
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

    let deleteEntity connection (description: QueryDescription) entityID =
        
        let mainTable = sprintf "%s.%s" description.MainTable.SchemaName description.MainTable.TableName

        let primaryKey = description.MainTable.Columns |> Seq.find (fun e -> e.Column.ColumnType = ColumnType.PrimaryKey)
        
        let query = sprintf "DELETE FROM %s WHERE %s = %s" mainTable primaryKey.Column.ColumnName entityID

        tryExecute connection query    
        
    let private appendLines (sb: SB) lines = lines |> Seq.iter (fun l -> sb.AppendLine l |> ignore)
    
    let updateEntity connection (description: QueryDescription) entityID (columns: Map<string,string>)= 
        let sb = new SB()
        let primaryKey = description.MainTable.Columns |> Seq.find (fun e -> e.Column.ColumnType = ColumnType.PrimaryKey)

        sprintf "UPDATE %s" description.MainTable.TableAlias |> sb.AppendLine |> ignore

        "SET " |> sb.AppendLine |> ignore

        columns |> Seq.map (fun e -> sprintf "%s = '%s'" e.Key e.Value) |> appendLines sb

        sprintf "FROM %s.%s %s" description.MainTable.SchemaName description.MainTable.TableName description.MainTable.TableAlias |> sb.AppendLine |> ignore

        sprintf "WHERE %s = %s" primaryKey.Column.ColumnName entityID |> sb.AppendLine |> ignore

        let query = sb.ToString()

        tryExecute connection query
        
