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
        table.Columns |> Seq.tryFind (fun e -> e.Column.ColumnType = ColumnType.PrimaryKey)
    
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
                            |> Seq.toList

        appendLines sb joins 
    
    let private getColumnsFromTable tables filter map =
         tables
            |> Seq.collect (fun e -> e.Columns 
                                    |> Seq.filter filter
                                    |> Seq.map map)
            |> Seq.toList
    
    let private columnVisibiltyFilter col =
        not (col.Column.ColumnType = ColumnType.PrimaryKey) && not col.Column.IsHidden

    let private getColumnAliasesExeptPrimary (tables: TableQueryDescription list) = 
        getColumnsFromTable tables columnVisibiltyFilter (fun c -> (c.Column.ColumnName, c.ColumnAlias))

    let private getColumnNamesWithAliasesExeptPrimary (tables: TableQueryDescription list) = 
        getColumnsFromTable tables columnVisibiltyFilter (fun c -> sprintf "%s.%s AS %s" c.TableAlias c.Column.ColumnName c.ColumnAlias)

    let private appendColumnNames (sb: SB) names =
        names |> Seq.map (fun n -> sprintf ",%s" n) |> appendLines sb

    let private mainTablePrimaryKey description = 

        description.MainTable 
            |> getPrimaryKey
            |> Option.bind (fun column -> sprintf "%s.%s AS %s" column.TableAlias column.Column.ColumnName column.ColumnAlias
                                            |> Some)

    let private getOrderingColumn tables = 
        tables
        |> Seq.collect (fun e -> e.Columns 
                                |> Seq.map (fun e -> e.ColumnAlias))
        |> Seq.head

    let appendOrder priamaryColumn firstAlias (sb: SB) = 
        let alias = match priamaryColumn with 
                    | Some column -> column.ColumnAlias
                    | None -> firstAlias

        sb.AppendLine(sprintf "ORDER BY %s" alias) |> ignore
    
    let private appendPagination offset limit (sb: SB) = 
        sb.AppendLine(sprintf "OFFSET %d ROWS" offset) |> ignore
        sb.AppendLine(sprintf "FETCH NEXT %d ROWS ONLY" limit) |> ignore

    let buildQuery offset limit (description: QueryDescription) = 
        let allTables = description.MainTable :: description.JoinedTables
        let columnNames = allTables |> getColumnNamesWithAliasesExeptPrimary

        let sb = SB()
        match mainTablePrimaryKey description with
            | Some mk -> (sprintf "SELECT %s" mk)
            | None -> "SELECT 1"
            |> sb.AppendLine |> ignore

        appendColumnNames sb columnNames

        appendFrom description.MainTable sb

        appendJoins description.JoinedTables sb allTables

        appendOrder (description.MainTable |> getPrimaryKey) (getOrderingColumn allTables) sb

        appendPagination offset limit sb

        sb.ToString()
    
    let buildCountQuery (description: QueryDescription) = 
        let allTables = description.MainTable :: description.JoinedTables

        let sb = SB()

        sb.AppendLine("SELECT COUNT(1) AS [Count]") |> ignore 

        appendFrom description.MainTable sb

        appendJoins description.JoinedTables sb allTables

        sb.ToString()

    let getHeaders description =
        let tables = (description.MainTable :: description.JoinedTables) 
        let mainKey = description.MainTable
                        |> getPrimaryKey 
        
        match mainKey with 
            | Some mk -> 
                        { KeyName = mk.ColumnAlias;
                          ColumnNames = getColumnAliasesExeptPrimary tables
                                         |> Seq.append [(mk.Column.ColumnName, mk.ColumnAlias)]
                                         |> Seq.toList
                        }
            | None -> { KeyName = getColumnAliasesExeptPrimary tables |> Seq.head |> (fun (_, alias) -> alias);
                        ColumnNames = getColumnAliasesExeptPrimary tables}