namespace BLogic.EzAdmin.Data.Schemas

open BLogic.EzAdmin.Data.QueryHandler
open BLogic.EzAdmin.Domain.Schema.Schema
open BLogic.EzAdmin.Domain.Sql

module SchemaRepository =
        let getAllSchemas = query<Schema> {
                                    Query = "SELECT SCHEMA_NAME Name FROM INFORMATION_SCHEMA.SCHEMATA";
                                    Parameters= []
                                        }


         


