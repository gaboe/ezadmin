namespace BLogic.EzAdmin.Data.Tests

open System
open Microsoft.VisualStudio.TestTools.UnitTesting
open BLogic.EzAdmin.Data.Repositories.SqlTypes.SqlTypeRepository
open BLogic.EzAdmin.Data.Engines.EngineRepository

[<TestClass>]
type MsSqlSchemaRepositoryTest () =

    [<TestMethod>]
    member this.GetAllSchemas () =
        let c = getAllSchemas |> Async.RunSynchronously
        Assert.IsTrue(true);

    [<TestMethod>]
    member this.ExecuteDynamicQuery () =
        let c = getDataFromDb |> Seq.toArray //|> Async.RunSynchronously
        Assert.IsTrue(true);
