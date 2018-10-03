namespace BLogic.EzAdmin.Data.Engines

open System.Data.SqlClient
open FSharp.Data
open BLogic.EzAdmin.Domain.UiTypes
open BLogic.EzAdmin.Domain.SchemaTypes

module EngineRepository =
    open System.Data
    open System.Text

    [<Literal>]
    let connectionString = "Data Source=localhost;Initial Catalog=eza;Integrated Security=True"

    type RowResultHeader = {KeyName: string; ColumnNames: string list}

    let getTable = {SchemaName = "dbo"; TableName = "Users"; Columns = [
          {
            ColumnName = "UserID";
            TableName = "Users";
            SchemaName = "dbo";
            KeyType = KeyType.PrimaryKey;
            Reference = Option.None;
          };
          {
            ColumnName = "FirstName";
            TableName = "Users";
            SchemaName = "dbo";
            KeyType = KeyType.None;
            Reference = Option.None;
          };
          {
            ColumnName = "LastName";
            TableName = "Users";
            SchemaName = "dbo";
            KeyType = KeyType.None;
            Reference = Option.None;
          };
        ]} 
    
    let getColumnName column = 
        column.ColumnName

    let appendColumn (columnName: string) (sb: StringBuilder) = 
        sb.Append(",") |> ignore
        sb.AppendLine(columnName) |> ignore
    
    let appendFrom (table: TableSchema) (sb: StringBuilder) =
        sb.Append("FROM ") |> ignore
        sb.Append(table.SchemaName) |> ignore
        sb.Append(".") |> ignore
        sb.AppendLine(table.TableName) |> ignore
    
    let isPrimaryKey (column: ColumnSchema) =
        column.KeyType = KeyType.PrimaryKey

    let isNotPrimaryKey (column: ColumnSchema) =
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

    let getDataFromDb = seq { 
      let table = getTable         
      let query = buildQuery table  //"SELECT UserID, FirstName, LastName FROM dbo.Users"
        
      use conn = new SqlConnection(connectionString)
      use cmd = new SqlCommand(query, conn)
      cmd.CommandType <- CommandType.Text

      let easyRow = {KeyName = "UserID"; ColumnNames = ["FirstName"; "LastName"]}

      let readRow (reader: SqlDataReader) = 
        let getRow name = {Name = name; Value = reader.[name] |> unbox |> string}
        getRow

      conn.Open()
      use reader = cmd.ExecuteReader()
      while reader.Read() do
        let toRow = readRow reader
        yield { 
                Key = reader.[easyRow.KeyName] |> unbox |> string 
                Columns = easyRow.ColumnNames |> Seq.map toRow |> Seq.toList
               }
        }     

