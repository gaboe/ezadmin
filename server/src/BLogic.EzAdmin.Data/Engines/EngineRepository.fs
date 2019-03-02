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

      conn.Open()
      use reader = cmd.ExecuteReader()
      while reader.Read() do

        let key = reader.[headers.KeyName] |> unbox |> string
        let columns = headers.ColumnNames 
                        |> Seq.map (fun (name, alias) -> {Name = name; ColumnAlias = alias; Value = reader.[alias] |> unbox |> string}) 
                        |> Seq.toList

        yield { 
                Key = key
                Columns = columns 
               }
        }     
    let getDynamicQueryResults table =
      let query = DynamicQueryBuilder.buildQuery table 
      let headers = DynamicQueryBuilder.getHeaders table
      
      let data = getDataFromDb query headers |> Seq.toList
      data

       

