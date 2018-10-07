namespace BLogic.EzAdmin.Core.Engines
open BLogic.EzAdmin.Domain.SchemaTypes

module SchemaTypeToQueryDescriptionConverter =

    let getColumnsFromTable tableName schemaName (columns: seq<ColumnSchema>) =
        columns 
            |> Seq.filter (fun e -> e.TableName = tableName && e.SchemaName = schemaName)
            |> Seq.toList

    let getMainTableColumns (tableSchema: TableSchema) =
        getColumnsFromTable tableSchema.TableName tableSchema.SchemaName tableSchema.Columns
        |> Seq.map (fun e -> {TableAlias = "MainTable"; Column = e}  )
        |> Seq.toList
    
    let getTableQueryDescription (tableSchema: TableSchema) (column: ColumnSchema) index =
        let alias = "[T" + string index + "]"
        
        let columns = getColumnsFromTable column.TableName column.SchemaName tableSchema.Columns
                       |> Seq.map ( fun e -> {TableAlias = alias; Column = e})
                       |> Seq.toList
        {
            TableAlias = alias;
            Table = tableSchema
            Columns = columns;
            Type = TableQueryDescriptionType.Foreign;

        }: TableQueryDescription


    let convert (tableSchema: TableSchema) =
        let primaryTable: TableQueryDescription = {
            TableAlias = "MainTable";
            Table = tableSchema;
            Columns = tableSchema |> getMainTableColumns;
            Type = Primary;
            }
        
        let toColumnSchema index column =
            getTableQueryDescription tableSchema column index

        let joinedTables = tableSchema.Columns 
                            |> Seq.filter (fun e -> e.KeyType = KeyType.ForeignKey)
                            |> Seq.mapi toColumnSchema
                            |> Seq.toList
        {
            TableQueryDescriptions= joinedTables |> Seq.append [primaryTable] |> Seq.toList
        }


