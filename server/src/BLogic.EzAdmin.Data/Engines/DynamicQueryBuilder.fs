namespace BLogic.EzAdmin.Data.Engines

open BLogic.EzAdmin.Domain.SchemaTypes
open BLogic.EzAdmin.Domain.Engines

module DynamicQueryBuilder =
    open System.Text

    let getColumnName column = 
        column.ColumnName

    let appendColumn columnName (sb: StringBuilder) = 
        sb.Append(",") |> ignore
        sb.AppendLine(columnName) |> ignore
    
    let appendFrom table (sb: StringBuilder) =
        sb.Append("FROM ") |> ignore
        sb.Append(table.SchemaName) |> ignore
        sb.Append(".") |> ignore
        sb.AppendLine(table.TableName) |> ignore
    
    let isPrimaryKey column =
        column.KeyType = KeyType.PrimaryKey

    let isNotPrimaryKey column =
        isPrimaryKey column |> not
    
    let getPrimaryTableMainKey table =
        table.Columns 
            |> Seq.find isPrimaryKey 
            |> getColumnName 

    let getColumnNamesOtherColumnNames table = 
        let isFromMainTable (column: ColumnSchema) =
            column.SchemaName = table.SchemaName 
            && column.TableName = table.TableName
        
        table.Columns 
            |> Seq.filter isFromMainTable
            |> Seq.filter isNotPrimaryKey
            |> Seq.map getColumnName 

    let buildQuery table = 
        let sb = StringBuilder()
        "SELECT " |> sb.AppendLine |> ignore

        getPrimaryTableMainKey table |> sb.AppendLine |> ignore
        
        getColumnNamesOtherColumnNames table |> Seq.iter (fun e -> appendColumn e sb)  

        appendFrom table sb

        sb.ToString()

    let getHeaders table =
        {
         KeyName = getPrimaryTableMainKey table;
         ColumnNames = getColumnNamesOtherColumnNames table 
                         |> Seq.append [getPrimaryTableMainKey table]
                         |> Seq.toList
        }

