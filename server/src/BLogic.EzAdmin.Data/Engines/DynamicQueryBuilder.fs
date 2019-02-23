namespace BLogic.EzAdmin.Data.Engines

open BLogic.EzAdmin.Domain.SchemaTypes
open BLogic.EzAdmin.Domain.Engines
open System.Text

type SB = StringBuilder

module DynamicQueryBuilder =
    let private getColumnName (column: ColumnQueryDescription) = 
        column.Column.ColumnName

    let private getColumnNameWithAlias (column: ColumnQueryDescription) = 
        column.TableAlias + "." + column.Column.ColumnName

    let private appendColumn columnName (sb: StringBuilder) = 
        sb.Append(",") |> ignore
        sb.AppendLine(columnName) |> ignore
    
    let private appendFrom table (sb: StringBuilder) =
        sb.Append("FROM ") |> ignore
        sb.Append(table.SchemaName) |> ignore
        sb.Append(".") |> ignore
        sb.Append(table.TableName) |> ignore
        sb.Append(" AS ") |> ignore
        sb.AppendLine(table.TableAlias) |> ignore
    
    let private isPrimaryKey column =
        column.Column.ColumnType = ColumnType.PrimaryKey

    let private isNotPrimaryKey column =
        isPrimaryKey column |> not
    
    let rec flattenColumns col = 
        match col.Column.Reference with 
            | Some r ->  flattenColumns {TableAlias= col.TableAlias; Column = r} 
                        |> Seq.collect (fun c -> [c])
                        |> Seq.append [col]
                        |> Seq.toList
            | Option.None -> [col] |> Seq.toList

    let private getPrimaryTableMainKey table =
        table.Columns
            |> Seq.map flattenColumns
            |> Seq.collect (fun e -> e)
            |> Seq.find isPrimaryKey

    let private appendJoin 
                    (sb: StringBuilder)
                    (resolveAlias: _ -> string)
                    (col: ColumnQueryDescription) =

        let (schema, table, column) = match col.Column.Reference with
                                        | Some e -> (e.SchemaName, e.TableName, e.ColumnName)
                                        | Option.None -> ("","","")
        let alias = (schema, table) |> resolveAlias

        let join = sprintf "JOIN %s.%s %s " col.Column.SchemaName col.Column.TableName col.TableAlias
                    + sprintf "ON "
                    + sprintf "%s.%s = %s.%s" alias column col.TableAlias col.Column.ColumnName 

        join |> sb.AppendLine |> ignore 

    let private appendJoins (foreignTables: TableQueryDescription list) (sb: StringBuilder) resolveAlias = 
        let foreignColumns = foreignTables 
                            |> Seq.collect
                                (fun e -> e.Columns 
                                            |> Seq.filter 
                                                (fun c -> c.Column.Reference.IsSome 
                                                          && c.Column.ColumnType = ColumnType.ForeignKey))
                            |> Seq.distinct
                            |> Seq.toList

        foreignColumns |> Seq.iter (fun e -> appendJoin sb resolveAlias e)
    
    let private getColumnsFromTable tables filter map =
         tables
            |> Seq.collect (fun e -> e.Columns 
                                    |> Seq.filter filter
                                    |> Seq.map map)
            |> Seq.toList

    let private getColumnNamesExeptPrimary (tables: TableQueryDescription list) = 
        let filter col = isNotPrimaryKey col && not col.Column.IsHidden
        getColumnsFromTable tables filter (fun c -> c.Column.ColumnName)

    let private getColumnNamesWithAliasesExeptPrimary (tables: TableQueryDescription list) = 
        let filter col = isNotPrimaryKey col && not col.Column.IsHidden
        getColumnsFromTable tables filter (fun c -> c.TableAlias + "." + c.Column.ColumnName)

    let private appendColumnNames (sb: SB) names =
        names |> Seq.iter (fun n -> appendColumn n sb |> ignore)

    let private resolveAlias tables (schemaName, tableName) =
        let table = tables
                    |> Seq.find (fun e -> e.SchemaName = schemaName
                                        && e.TableName = tableName)
        table.TableAlias                                        

    let buildQuery (description: QueryDescription) = 
        let sb = StringBuilder()
        "SELECT " |> sb.AppendLine |> ignore
        
        description.MainTable 
            |> getPrimaryTableMainKey
            |> getColumnNameWithAlias
            |> sb.AppendLine
            |> ignore
        let allTables = description.MainTable :: description.JoinedTables

        let columnNames = allTables |> getColumnNamesWithAliasesExeptPrimary

        appendColumnNames sb columnNames

        appendFrom description.MainTable sb

        let resAlias = resolveAlias allTables
        appendJoins description.JoinedTables sb resAlias

        sb.ToString()

    let getHeaders description =
        let tables = (description.MainTable :: description.JoinedTables) 
        let mainKey = description.MainTable
                        |> getPrimaryTableMainKey 
                        |> getColumnName

        {
         KeyName = mainKey;
         ColumnNames = getColumnNamesExeptPrimary tables
                         |> Seq.append [mainKey]
                         |> Seq.toList
        }

