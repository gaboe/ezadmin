namespace BLogic.EzAdmin.Core.Engines
open BLogic.EzAdmin.Domain.SchemaTypes
open BLogic.EzAdmin.Data.Engines

module DescriptionConverter =
    type OtherTable = {Alias: string; SchemaName: string; TableName: string}
    
    type LeveledColumnSchema = {Entity: ColumnSchema; Level: int;}

    let rec denormalizeColumns (col: ColumnSchema) (denormalized: LeveledColumnSchema list) level: LeveledColumnSchema list = 
        match col.Reference with 
            | Some r ->  denormalizeColumns r (denormalized @ [{Entity = col; Level = level}]) (level + 1)
            | None -> denormalized @ [{Entity = col; Level = level}]

    let getColumnsFromTable tableName schemaName (columns: seq<ColumnSchema>) =
        columns 
            |> Seq.collect (fun e -> denormalizeColumns e List.empty 1)
            |> Seq.filter (fun e -> e.Entity.TableName = tableName && e.Entity.SchemaName = schemaName)
            |> Seq.toList

    let getMainTableColumns (tableSchema: TableSchema) =
        getColumnsFromTable tableSchema.TableName tableSchema.SchemaName tableSchema.Columns
        |> Seq.map (fun e -> {  TableAlias = ColumnAliasProvider.mainTableAlias;
                                Column = e.Entity;
                                ColumnAlias = ColumnAliasProvider.columnAlias ColumnAliasProvider.mainTableAlias e.Entity })
        |> Seq.toList
    
    let getTableQueryDescription (table: OtherTable) (allColumns: ColumnSchema list) =
        
        let columns = getColumnsFromTable table.TableName table.SchemaName allColumns
                               |> Seq.map (fun e -> {   TableAlias = table.Alias;
                                                        Column = e.Entity;
                                                        ColumnAlias = ColumnAliasProvider.columnAlias table.Alias e.Entity })
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
            TableAlias = ColumnAliasProvider.mainTableAlias;
            TableName = tableSchema.TableName;
            SchemaName = tableSchema.SchemaName;
            Columns = tableSchema |> getMainTableColumns;
            Type = Primary;
            }

        let notPrimaryColumns = 
                        tableSchema.Columns 
                            |> Seq.collect (fun e -> denormalizeColumns e List.empty 1)
                            |> Seq.where (fun e -> not(e.Entity.SchemaName = primaryTable.SchemaName && e.Entity.TableName = primaryTable.TableName) )
                            |> Seq.sortByDescending (fun e -> e.Level)
                            |> Seq.toList
        
        let otherTables = notPrimaryColumns
                            |> Seq.map (fun e -> (e.Entity.SchemaName, e.Entity.TableName))
                            |> Seq.distinct
                            |> Seq.mapi (fun i (schema, table) -> { Alias = sprintf "[T%d]" i;
                                                                    SchemaName = schema; 
                                                                    TableName = table} )
                            |> Seq.toList

        let joinedTables = otherTables
                            |> Seq.map (fun e -> getTableQueryDescription e (notPrimaryColumns |> Seq.map (fun e -> e.Entity) |> Seq.toList)) 
                            |> Seq.toList

        {
            MainTable = primaryTable;
            JoinedTables = joinedTables
        }


