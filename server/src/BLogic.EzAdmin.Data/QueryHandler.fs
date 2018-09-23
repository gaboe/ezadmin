namespace BLogic.EzAdmin.Data

open BLogic.EzAdmin.Domain.Sql
open System.Data.SqlClient
open Dapper

module QueryHandler = 

        [<Literal>]
        let connectionString = "Data Source=localhost;Initial Catalog=eza;Integrated Security=True" ;

        let query<'T> q =
            async {
                use connection = new SqlConnection(connectionString)
                do! connection.OpenAsync() |> Async.AwaitTask
                let! result =
                    connection.QueryAsync<'T>(q.Query, dict q.Parameters)
                        |> Async.AwaitTask
                return Array.ofSeq result
            }