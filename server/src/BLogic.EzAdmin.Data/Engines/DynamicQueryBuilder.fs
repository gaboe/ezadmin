namespace BLogic.EzAdmin.Data.Engines

open BLogic.EzAdmin.Domain.SchemaTypes
open BLogic.EzAdmin.Domain.Engines
open System.Text

type SB = StringBuilder

module DynamicQueryBuilder =
    let private appendLines (sb: SB) lines = lines |> Seq.iter (fun l -> sb.AppendLine l |> ignore)

    let private appendFrom table (sb: SB) =
        sprintf "FROM %s.%s AS %s" table.SchemaName table.TableName table.TableAlias 
            |> sb.AppendLine |> ignore
    
    let private getPrimaryKey table =
        table.Columns |> Seq.find (fun e -> e.Column.ColumnType = ColumnType.PrimaryKey)
    
    let private resolveAlias schemaName tableName alltables =
        let table = alltables
                    |> Seq.find (fun e -> e.SchemaName = schemaName
                                        && e.TableName = tableName)
        table.TableAlias  
        
    let private appendJoin alltables col (reference: ColumnSchema) =
        let alias = resolveAlias reference.SchemaName reference.TableName alltables

        let join = sprintf "JOIN %s.%s %s " col.Column.SchemaName col.Column.TableName col.TableAlias
                    + sprintf "ON "
                    + sprintf "%s.%s = %s.%s" alias reference.ColumnName col.TableAlias col.Column.ColumnName 

        join 

    let private appendJoins (foreignTables: TableQueryDescription list) (sb: SB) allTables = 
        let joins = foreignTables 
                            |> Seq.collect
                                (fun e -> e.Columns 
                                            |> Seq.filter 
                                                (fun c -> c.Column.Reference.IsSome 
                                                          && c.Column.ColumnType = ColumnType.ForeignKey))
                            |> Seq.distinct
                            |> Seq.map (fun e -> match e.Column.Reference with
                                                                | Some r -> appendJoin allTables e r
                                                                | None -> "")
                            |> Seq.where (fun e -> not (System.String.IsNullOrEmpty e))

        appendLines sb joins 
    
    let private getColumnsFromTable tables filter map =
         tables
            |> Seq.collect (fun e -> e.Columns 
                                    |> Seq.filter filter
                                    |> Seq.map map)
            |> Seq.toList
    
    let private columnVisibiltyFilter col =
        not (col.Column.ColumnType = ColumnType.PrimaryKey) && not col.Column.IsHidden

    let private getColumnNamesExeptPrimary (tables: TableQueryDescription list) = 
        getColumnsFromTable tables columnVisibiltyFilter (fun c -> c.Column.ColumnName)

    let private getColumnNamesWithAliasesExeptPrimary (tables: TableQueryDescription list) = 
        getColumnsFromTable tables columnVisibiltyFilter (fun c -> c.TableAlias + "." + c.Column.ColumnName)

    let private appendColumnNames (sb: SB) names =
        names |> Seq.map (fun n -> sprintf ",%s" n) |> appendLines sb

    let private mainTablePrimaryKey description = 
        description.MainTable 
            |> getPrimaryKey
            |> fun column -> sprintf "%s.%s" column.TableAlias column.Column.ColumnName

    let buildQuery (description: QueryDescription) = 
        let allTables = description.MainTable :: description.JoinedTables
        let columnNames = allTables |> getColumnNamesWithAliasesExeptPrimary

        let sb = SB()
        (sprintf "SELECT %s" (mainTablePrimaryKey description)) |> sb.AppendLine |> ignore

        appendColumnNames sb columnNames

        appendFrom description.MainTable sb

        appendJoins description.JoinedTables sb allTables

        sb.ToString()

    let getHeaders description =
        let tables = (description.MainTable :: description.JoinedTables) 
        let mainKey = description.MainTable
                        |> getPrimaryKey 
                        |> (fun e -> e.Column.ColumnName)

        {
         KeyName = mainKey;
         ColumnNames = getColumnNamesExeptPrimary tables
                         |> Seq.append [mainKey]
                         |> Seq.toList
        }