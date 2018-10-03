namespace BLogic.EzAdmin.Data.Engines

open System.Data.SqlClient
open Dapper
open FSharp.Data
open FSharp.Interop.Dynamic
open FSharp.Interop.Dynamic.Operators
open BLogic.EzAdmin.Domain.UiTypes
module EngineRepository =
    open System.Data


    [<Literal>]
    let connectionString = "Data Source=localhost;Initial Catalog=eza;Integrated Security=True"
    
    type DapperRow = {values: string array}

    //let getDataFromDb = seq {

    //    use conn = new SqlConnection(connectionString)
    //    use cmd = new SqlCommand("GetPhotos", conn)
    //    cmd.CommandType <- CommandType.Text
    //    conn.Open()
    //    use reader = cmd.ExecuteReader()
    //      while reader.Read() do
    //        yield { PhotoID = unbox (reader.["PhotoID"])
    //                PhotoAlbumID = unbox (reader.["AlbumID"])
    //                PhotoCaption = unbox (reader.["Caption"])} }
    //    }
    type U=  {UserID: int; FirstName: string; LastName: string}
    let getDataFromDb = seq { 
      let query = "SELECT UserID, FirstName, LastName FROM dbo.Users"
        
      // Create a command to call SQL stored procedure
      use conn = new SqlConnection(connectionString)
      use cmd = new SqlCommand(query, conn)
      cmd.CommandType <- CommandType.Text

    
      // Run the command and read results into an F# record
      conn.Open()
      use reader = cmd.ExecuteReader()
      while reader.Read() do
        yield { Key = (unbox (reader.["UserID"])).ToString()  
                Columns = [{Name = "FirstName"; Value = (unbox (reader.["FirstName"])).ToString() };
                {Name = "LastName"; Value = (unbox (reader.["LastName"])).ToString()};
                ]
               }
        }
        //async {
        //    use connection = new SqlConnection(connectionString)
        //    do! connection.OpenAsync() |> Async.AwaitTask
        //    let result = connection.Query(query) |> Seq.toArray
           
        //    //let rows = result |> Array.map (fun c -> c?)
        //    let mapToObj (d) =
        //            let e = box d
        //            let ee = e?values
        //            //let c = ee :?> DapperRow
        //            ""
        //    let mapped = result |> Seq.map mapToObj |> Seq.toArray
        //    return mapped
        //}

            

