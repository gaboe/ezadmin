namespace BLogic.EzAdmin.Core.Engines
open BLogic.EzAdmin.Domain.SchemaTypes

module DescriptionConverter =
    type OtherTable = {Alias: string; SchemaName: string; TableName: string}

    let rec denormalizeColumns (col: ColumnSchema) (denormalized: ColumnSchema list): ColumnSchema list = 
        match col.Reference with 
            | Some r ->  denormalizeColumns r (denormalized @ [col])
            | None -> denormalized @ [col]

    let getColumnsFromTable tableName schemaName (columns: seq<ColumnSchema>) =
        columns 
            |> Seq.collect (fun e -> denormalizeColumns e List.empty)
            |> Seq.filter (fun e -> e.TableName = tableName && e.SchemaName = schemaName)
            |> Seq.toList

    let getMainTableColumns (tableSchema: TableSchema) =
        getColumnsFromTable tableSchema.TableName tableSchema.SchemaName tableSchema.Columns
        |> Seq.map (fun e -> {TableAlias = "[MainTable]"; Column = e}  )
        |> Seq.toList
    
    let getTableQueryDescription (table: OtherTable) (allColumns: ColumnSchema list) (tableSchema: TableSchema) =
        
        let columns = getColumnsFromTable table.TableName table.SchemaName allColumns
                               |> Seq.map (fun e -> {TableAlias = table.Alias; Column = e})
                               |> Seq.toList
        
        {
            TableAlias = table.Alias;
            TableName = table.TableName;
            SchemaName = table.SchemaName;
            Columns = columns;
            Type = TableQueryDescriptionType.Foreign;
        }: TableQueryDescription

    let convertToDescription (tableSchema: TableSchema): QueryDescription =
        let primaryTable = {
            TableAlias = "[MainTable]";
            TableName = tableSchema.TableName;
            SchemaName = tableSchema.SchemaName;
            Columns = tableSchema |> getMainTableColumns;
            Type = Primary;
            }

        let notPrimaryColumns = 
                        tableSchema.Columns 
                            |> Seq.collect (fun e -> denormalizeColumns e List.empty)
                            |> Seq.where (fun e -> not(e.SchemaName = primaryTable.SchemaName && e.TableName = primaryTable.TableName) )
                            |> Seq.toList
        
        let otherTables = notPrimaryColumns
                            |> Seq.map (fun e -> (e.SchemaName, e.TableName))
                            |> Seq.distinct
                            |> Seq.mapi (fun i (schema, table) -> { Alias = sprintf "[T%d]" i;
                                                                    SchemaName = schema; 
                                                                    TableName = table} )
                            |> Seq.toList

        let joinedTables = otherTables
                            |> Seq.map (fun e -> getTableQueryDescription e notPrimaryColumns tableSchema) 
                            |> Seq.toList

        {
            MainTable = primaryTable;
            JoinedTables = joinedTables
        }


