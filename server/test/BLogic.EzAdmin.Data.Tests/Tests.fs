namespace BLogic.EzAdmin.Data.Tests

open System
open Microsoft.VisualStudio.TestTools.UnitTesting
open BLogic.EzAdmin.Data.Repositories.SqlTypes.SqlTypeRepository

[<TestClass>]
type MsSqlSchemaRepositoryTest () =

    [<TestMethod>]
    member this.GetAllSchemas () =
        let c = getAllSchemas |> Async.RunSynchronously
        Assert.IsTrue(true);
