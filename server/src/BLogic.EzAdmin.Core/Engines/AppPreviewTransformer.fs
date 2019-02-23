namespace BLogic.EzAdmin.Core.Engines
open BLogic.EzAdmin.Domain.GraphQL
module AppPreviewTransformer = 
    open BLogic.EzAdmin.Domain.SchemaTypes

    let tranformToSchema input : TableSchema= 
        let getKeyType (col: ColumnInput) =
            let isFromPrimary = col.schemaName = input.schemaName && col.tableName = input.tableName
            match isFromPrimary with 
                | true -> match col.isPrimaryKey with
                            | true -> ColumnType.PrimaryKey
                            | false -> ColumnType.Column
                | false -> match col.keyReference with 
                                | Some _ -> ColumnType.ForeignKey
                                | _ -> ColumnType.Column

        let rec toColumnSchema (col: ColumnInput) : ColumnSchema =
            {ColumnName = col.columnName;
            TableName = col.tableName;
            SchemaName = col.schemaName;
            IsHidden = col.isHidden;
            ColumnType = getKeyType col;
            Reference = match col.keyReference with
                            | Some r -> toColumnSchema r |> Some
                            | Option.None -> Option.None
            }

        let rec denormalize (columnSchema: ColumnSchema): ColumnSchema list = 
            match columnSchema.Reference with 
                | Option.Some r -> denormalize r @ [columnSchema]
                | Option.None -> [columnSchema]

        let columns = input.columns 
                        |> Seq.map toColumnSchema
                        //|> Seq.collect denormalize
                        |> Seq.toList

        {
            SchemaName = input.schemaName;
            TableName = input.tableName;
            Columns = columns
        }
        

