namespace BLogic.EzAdmin.Core.Engines
open BLogic.EzAdmin.Domain.GraphQL
module AppPreviewTransformer = 
    open BLogic.EzAdmin.Domain.SchemaTypes

    let tranformToSchema input : TableSchema= 
        let getKeyType (col: ColumnInput) =
            let isFromPrimary = col.schemaName = input.schemaName && col.tableName = input.tableName
            match isFromPrimary with 
                | true -> match col.isPrimaryKey with
                            | true -> KeyType.PrimaryKey
                            | false -> KeyType.None
                | false -> match col.keyReference with 
                                | Some _ -> KeyType.ForeignKey
                                | _ -> KeyType.None

        let rec toColumnSchema (col: ColumnInput) : ColumnSchema =
            {ColumnName = col.columnName;
            TableName = col.tableName;
            SchemaName = col.schemaName;
            IsHidden = col.isHidden;
            KeyType = getKeyType col;
            Reference = match col.keyReference with
                            | Some r -> toColumnSchema r |> Some
                            | Option.None -> Option.None
            }

        let columns = input.columns |> Seq.map toColumnSchema |> Seq.toList
        {
            SchemaName = input.schemaName;
            TableName = input.tableName;
            Columns = columns
        }
        

