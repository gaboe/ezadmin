namespace BLogic.EzAdmin.Core.Engines
open BLogic.EzAdmin.Domain.GraphQL
open BLogic.EzAdmin.Domain.SchemaTypes

module AppInputTransformer = 
    open MongoDB.Bson

    let isForeignKey (col: ColumnInput) (reference: ColumnInput option) = 
        let isFromSameTable (r:ColumnInput) = col.schemaName = r.schemaName && col.tableName = r.tableName
        match reference with 
            | Some r -> isFromSameTable r
            | None -> true

    let tranformToSchema input : TableSchema= 
        let getKeyType (col: ColumnInput) =
            let isFromPrimary = col.schemaName = input.schemaName && col.tableName = input.tableName
            match isFromPrimary with 
                | true -> match col.isPrimaryKey with
                            | true -> ColumnType.PrimaryKey
                            | false -> ColumnType.Column
                | false -> match col.keyReference with 
                                | Some r -> match (r.schemaName = col.schemaName && r.tableName = col.tableName && not(isForeignKey col r.keyReference)) with 
                                            | true -> ColumnType.Column
                                            | false -> ColumnType.ForeignKey
                                | None -> ColumnType.Column

        let rec toColumnSchema (col: ColumnInput) : ColumnSchema =
            {ColumnID = ObjectId.GenerateNewId();
            ColumnName = col.columnName;
            TableName = col.tableName;
            SchemaName = col.schemaName;
            IsHidden = col.isHidden;
            ColumnType = getKeyType col;
            Reference = col.keyReference |> Option.bind (fun r -> toColumnSchema r |> Some)
            }

        let columns = input.columns 
                        |> Seq.map toColumnSchema
                        |> Seq.toList

        {
            TableID = ObjectId.GenerateNewId();
            SchemaName = input.schemaName;
            TableName = input.tableName;
            Columns = columns
        }
        

