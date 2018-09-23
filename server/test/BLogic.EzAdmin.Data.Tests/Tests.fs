namespace BLogic.EzAdmin.Data.Tests

open System
open Microsoft.VisualStudio.TestTools.UnitTesting
open BLogic.EzAdmin.Data.Schemas.MsSqlSchemaRepository
[<TestClass>]
type MsSqlSchemaRepositoryTest () =

    [<TestMethod>]
    member this.GetAllSchemas () =
        let c = get |> Async.RunSynchronously
        Assert.IsTrue(true);
