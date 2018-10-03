namespace BLogic.EzAdmin.Data.Engines

open System.Data.SqlClient
open FSharp.Data
open BLogic.EzAdmin.Domain.UiTypes
module EngineRepository =
    open System.Data

    [<Literal>]
    let connectionString = "Data Source=localhost;Initial Catalog=eza;Integrated Security=True"

    type ExpectedRow = {KeyName: string; ColumnNames: string list}

    let getDataFromDb = seq { 
      let query = "SELECT UserID, FirstName, LastName FROM dbo.Users"
        
      // Create a command to call SQL stored procedure
      use conn = new SqlConnection(connectionString)
      use cmd = new SqlCommand(query, conn)
      cmd.CommandType <- CommandType.Text

      let easyRow = {KeyName = "UserID"; ColumnNames = ["FirstName"; "LastName"]}

      let readRow (reader: SqlDataReader) = 
        let getRow name = {Name = name; Value = (unbox (reader.[name])).ToString()}
        getRow

      // Run the command and read results into an F# record
      conn.Open()
      use reader = cmd.ExecuteReader()
      while reader.Read() do
        let toRow = readRow reader
        yield { 
                Key = (unbox (reader.[easyRow.KeyName])).ToString()  
                Columns = easyRow.ColumnNames |> Seq.map toRow |> Seq.toList
               }
        }     

