namespace BLogic.EzAdmin.Data

open BLogic.EzAdmin.Domain.Sql
open System.Data.SqlClient
open Dapper

module QueryHandler = 
        open System

        let query<'T> q =
            async {
                use connection = new SqlConnection(q.Connection)
                do! connection.OpenAsync() |> Async.AwaitTask
                let! result =
                    connection.QueryAsync<'T>(q.Query, dict q.Parameters)
                        |> Async.AwaitTask
                return Array.ofSeq result
            }

        let querySingle<'T> q =
            async {
                use connection = new SqlConnection(q.Connection)
                do! connection.OpenAsync() |> Async.AwaitTask
                let! result =
                    connection.QuerySingleOrDefaultAsync<'T>(q.Query, dict q.Parameters)
                        |> Async.AwaitTask
                return match Object.ReferenceEquals(result, null) with
                        | true -> None
                        | false -> Some result
            }