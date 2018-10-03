namespace BLogic.EzAdmin.Data.Engines

open System.Data.SqlClient
open FSharp.Data
open BLogic.EzAdmin.Domain.UiTypes
open BLogic.EzAdmin.Domain.SchemaTypes

module EngineRepository =
    open System.Data

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
    
    let getDataFromDb = seq { 
      let table = getTable         
      let query = DynamicQueryBuilder.buildQuery table  //"SELECT UserID, FirstName, LastName FROM dbo.Users"
        
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

