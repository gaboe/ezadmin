namespace BLogic.EzAdmin.Core.Engines
open BLogic.EzAdmin.Domain.SchemaTypes

module DescriptionConverter =

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
            TableName = column.TableName;
            SchemaName = column.SchemaName;
            Columns = columns;
            Type = TableQueryDescriptionType.Foreign;

        }: TableQueryDescription


    let convertToDescription (tableSchema: TableSchema) =
        let primaryTable = {
            TableAlias = "MainTable";
            TableName = tableSchema.TableName;
            SchemaName = tableSchema.SchemaName;
            Columns = tableSchema |> getMainTableColumns;
            Type = Primary;
            }
        
        let toColumnSchema index column =
            getTableQueryDescription tableSchema column index

        let joinedTables = tableSchema.Columns 
                            |> Seq.where (fun e -> not(e.SchemaName = primaryTable.SchemaName && e.TableName = primaryTable.TableName) )
                            |> Seq.mapi toColumnSchema
                            |> Seq.distinct
                            |> Seq.toList
        {
            TableQueryDescriptions = joinedTables 
                                    |> Seq.append [primaryTable]
                                    |> Seq.toList
        }


