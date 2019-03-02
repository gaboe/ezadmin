namespace BLogic.EzAdmin.Data.Engines

open System.Data.SqlClient
open FSharp.Data
open BLogic.EzAdmin.Domain.UiTypes

module EngineRepository =
    open System.Data
    open BLogic.EzAdmin.Data.Engines
    open BLogic.EzAdmin.Domain.Engines

    let getDataFromDb query (headers: RowResultHeader) = seq { 
      use conn = new SqlConnection(ConnectionProvider.connectionString)
      use cmd = new SqlCommand(query, conn)
      cmd.CommandType <- CommandType.Text

      let readRow (reader: SqlDataReader) = 
        let getRow name = {Name = name; Value = reader.[name] |> unbox |> string}
        getRow

      conn.Open()
      use reader = cmd.ExecuteReader()
      while reader.Read() do
        let toRow = readRow reader
        yield { 
                Key = reader.[headers.KeyName] |> unbox |> string 
                Columns = headers.ColumnNames |> Seq.map toRow |> Seq.toList
               }
        }     
    let getDynamicQueryResults table =
      let query = DynamicQueryBuilder.buildQuery table 
      let headers = DynamicQueryBuilder.getHeaders table
      
      let data = getDataFromDb query headers
      data |> Seq.toList

       

