namespace BLogic.EzAdmin.Data.Engines

open BLogic.EzAdmin.Domain.SchemaTypes
open BLogic.EzAdmin.Data
open MongoDB.Bson

module EngineCommands =
    type SB = System.Text.StringBuilder

    type UpdateSchema = {Table: TableQueryDescription; Column: ColumnQueryDescription; Value: string;}

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
        
    let updateEntity connection (description: QueryDescription) entityID (columns: Map<string,string>)= 
        
        let allTables = [description.MainTable] @ description.JoinedTables
        let columnDescriptions = allTables
                                |> Seq.collect (fun e -> e.Columns)
                                |> Seq.toList
        let tablesToUpdate = columns 
                                |> Seq.map (fun e -> ((e.Key |> ObjectId.Parse), e.Value))
                                |> Seq.map (fun (columnID, value) -> {Table = allTables |> Seq.find (fun t -> t.Columns |> Seq.exists (fun x -> x.Column.ColumnID = columnID));
                                                                      Value = value;
                                                                      Column = columnDescriptions |> Seq.find (fun e -> e.Column.ColumnID = columnID)})
                                |> Seq.toList
        let sb = new SB()

        let getUpdateQuery table (column: ColumnQueryDescription) value = 
            sprintf """
                    UPDATE %s
                    SET %s = '%s'
                    FROM  %s.%s %s
                    """ 
                    table.TableAlias 
                    column.Column.ColumnName value
                    table.SchemaName table.TableName table.TableAlias
        
        let getDescription columnSchema = columnDescriptions |> Seq.find (fun e -> e.Column.ColumnID = columnSchema.ColumnID)


        let rec getJoin (columnSchema: ColumnSchema) id = 
            match columnSchema.ColumnType with 
                | PrimaryKey -> id
                | ForeignKey -> match columnSchema.Reference with 
                                | Some r -> (getJoin r id)
                                | None -> ""
                | Column -> match columnSchema.Reference with 
                        | Some r -> sprintf "SELECT %s FROM %s.%s WHERE %s IN (%s)" columnSchema.ColumnName r.SchemaName r.TableName r.ColumnName (getJoin r id)
                        | None -> ""
        
        let getCondition columnSchema = 
             let description = getDescription columnSchema
             sprintf "WHERE %s.%s IN (%s)" description.TableAlias description.Column.ColumnName (getJoin columnSchema entityID)
        
        tablesToUpdate |> Seq.iter (fun table ->    getUpdateQuery table.Table table.Column table.Value |> sb.AppendLine |> ignore

                                                    match table.Column.Column.Reference with
                                                    | Some nextColumn -> getCondition nextColumn
                                                    | None -> "WHERE 1 = 0"
                                                    |> sb.AppendLine
                                                    |> ignore
                                    )

        let query = sb.ToString()

        tryExecute connection query
