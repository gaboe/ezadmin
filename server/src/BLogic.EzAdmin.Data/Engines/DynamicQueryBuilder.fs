namespace BLogic.EzAdmin.Data.Engines

open BLogic.EzAdmin.Domain.SchemaTypes
open BLogic.EzAdmin.Domain.Engines
open System.Text

type SB = StringBuilder

module DynamicQueryBuilder =
    open System.Text

    let getColumnName (column: ColumnQueryDescription) = 
        column.Column.ColumnName

    let getColumnNameWithAlias (column: ColumnQueryDescription) = 
        column.TableAlias + "." + column.Column.ColumnName

    let appendColumn columnName (sb: StringBuilder) = 
        sb.Append(",") |> ignore
        sb.AppendLine(columnName) |> ignore
    
    let appendFrom table (sb: StringBuilder) =
        sb.Append("FROM ") |> ignore
        sb.Append(table.SchemaName) |> ignore
        sb.Append(".") |> ignore
        sb.Append(table.TableName) |> ignore
        sb.Append(" AS ") |> ignore
        sb.AppendLine(table.TableAlias) |> ignore
    
    let isPrimaryKey column =
        column.Column.KeyType = KeyType.PrimaryKey

    let isNotPrimaryKey column =
        isPrimaryKey column |> not
    
    let getPrimaryTableMainKey table =
        table.Columns 
            |> Seq.find isPrimaryKey 
    
    let appendJoin 
                    (sb: StringBuilder)
                    (resolveAlias: _ -> string)
                    (col: ColumnQueryDescription) =

        let (schema, table, column) = match col.Column.Reference with
                                        | Some e -> (e.SchemaName, e.TableName, e.ColumnName)
                                        | Option.None -> ("","","")

        "JOIN " |> sb.Append |> ignore
        col.Column.SchemaName |> sb.Append |> ignore
        "." |> sb.Append |> ignore
        col.Column.TableName |> sb.Append |> ignore
        " " |> sb.Append |> ignore
        col.TableAlias |> sb.Append |> ignore
        " ON " |> sb.Append |> ignore
        (schema, table) |> resolveAlias |> sb.Append |> ignore
        "." |> sb.Append |> ignore
        column |> sb.Append |> ignore
        " = " |> sb.Append |> ignore
        col.TableAlias |> sb.Append |> ignore
        "." |> sb.Append |> ignore
        col.Column.ColumnName |> sb.AppendLine |> ignore

    let appendJoins (foreignTables: seq<TableQueryDescription>) (sb: StringBuilder) resolveAlias = 
        let foreignColumns = foreignTables 
                            |> Seq.collect
                                (fun e -> e.Columns 
                                            |> Seq.filter (fun c -> c.Column.Reference.IsSome 
                                                                    && c.Column.KeyType = KeyType.ForeignKey))

        let appendJoinToStringBuilder =
            appendJoin sb resolveAlias

        foreignColumns |> Seq.iter appendJoinToStringBuilder
    
    
    let getColumnsFromTable tables filter map =
         tables
            |> Seq.collect (fun e -> e.Columns 
                                    |> Seq.filter filter
                                    |> Seq.map map)
            |> Seq.toList

    let getColumnNamesExeptPrimary (tables: TableQueryDescription list) = 
        getColumnsFromTable tables isNotPrimaryKey (fun c -> c.Column.ColumnName)
       

    let getColumnNamesWithAliasesExeptPriamary (tables: TableQueryDescription list) = 
        getColumnsFromTable tables isNotPrimaryKey (fun c -> c.TableAlias + "." + c.Column.ColumnName)

    let appendColumnNames (sb: SB) names =
        names |> Seq.iter (fun n -> sb.Append(",") |> ignore; sb.AppendLine(n) |> ignore)

    let getTables description t =
         description.TableQueryDescriptions 
            |> Seq.filter (fun e -> e.Type = t)

    let getMainTable description =
        getTables description TableQueryDescriptionType.Primary
        |> Seq.head

    let getForeignTables description =
        getTables description TableQueryDescriptionType.Foreign
    
    let resolveAlias tables (schemaName, tableName) =
        let table = tables
                    |> Seq.find (fun e -> e.SchemaName = schemaName
                                        && e.TableName = tableName)
        table.TableAlias                                        

    let buildQuery (description: QueryDescription) = 
        let sb = StringBuilder()
        "SELECT " |> sb.AppendLine |> ignore
        
        let mainTable = description |> getMainTable
        mainTable 
            |> getPrimaryTableMainKey
            |> getColumnNameWithAlias
            |> sb.AppendLine
            |> ignore

        let names = description.TableQueryDescriptions 
                    |> getColumnNamesWithAliasesExeptPriamary
                    
        let resAlias = resolveAlias description.TableQueryDescriptions
        appendColumnNames sb names

        appendFrom mainTable sb
        appendJoins (getForeignTables description) sb resAlias
        sb.ToString()

    let getHeaders description =
        let mainKey = description 
                        |> getMainTable 
                        |> getPrimaryTableMainKey 
                        |> getColumnName
        {
         KeyName = mainKey;
         ColumnNames = getColumnNamesExeptPrimary description.TableQueryDescriptions 
                         |> Seq.append [mainKey]
                         |> Seq.toList
        }

