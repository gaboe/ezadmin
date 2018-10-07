namespace BLogic.EzAdmin.Data.Tests

open System
open Microsoft.VisualStudio.TestTools.UnitTesting
open BLogic.EzAdmin.Data.Engines.EngineRepository
open BLogic.EzAdmin.Domain.SchemaTypes
open BLogic.EzAdmin.Core.Engines.SchemaTypeToQueryDescriptionConverter

[<TestClass>]
type MsSqlSchemaRepositoryTest () =
    let table: TableSchema = {SchemaName = "dbo"; TableName = "Users"; Columns = [
                      {
                        ColumnName = "UserID";
                        TableName = "Users";
                        SchemaName = "dbo";
                        KeyType = KeyType.PrimaryKey;
                        Reference = Option.None;
                        IsHidden = false;
                      };
                      {
                        ColumnName = "FirstName";
                        TableName = "Users";
                        SchemaName = "dbo";
                        KeyType = KeyType.None;
                        Reference = Option.None;
                        IsHidden = false;
                      };
                      {
                        ColumnName = "LastName";
                        TableName = "Users";
                        SchemaName = "dbo";
                        KeyType = KeyType.None;
                        Reference = Option.None;
                        IsHidden = false;
                      };
                      {
                        ColumnName = "UserID";
                        TableName = "UserApplications";
                        SchemaName = "dbo";
                        KeyType = KeyType.ForeignKey;
                        Reference = Some {
                            ColumnName = "UserID";
                            TableName = "Users";
                            SchemaName = "dbo";
                            KeyType = KeyType.PrimaryKey;
                            Reference = Option.None;
                            IsHidden = false;
                          };
                        IsHidden = false;
                      };
                      {
                        ColumnName = "ApplicationID";
                        TableName = "Applications";
                        SchemaName = "dbo";
                        KeyType = KeyType.ForeignKey;
                        Reference = Some {
                            ColumnName = "ApplicationID";
                            TableName = "UserApplications";
                            SchemaName = "dbo";
                            KeyType = KeyType.None;
                            Reference = Option.None;
                            IsHidden = false;
                          };
                        IsHidden = true;
                      };
                      {
                        ColumnName = "Name";
                        TableName = "Applications";
                        SchemaName = "dbo";
                        KeyType = KeyType.None;
                        Reference = Option.None;
                        IsHidden = false;
                      };
                    ]}

    [<TestMethod>]
    member this.ExecuteDynamicQuery () =
        let c = table |> convert |> getDynamicQueryResults |> Seq.toList
        Assert.IsTrue(c.Length > 0);
        Assert.AreEqual(5, c.Head.Columns.Length);
