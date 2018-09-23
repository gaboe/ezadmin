namespace BLogic.EzAdmin.Data.Repositories.SqlTypes

open BLogic.EzAdmin.Data.QueryHandler
open BLogic.EzAdmin.Domain.Sql
open BLogic.EzAdmin.Domain.SqlTypes

module SqlTypeRepository =
        let getAllSchemas = query<SqlSchema> {
                                    Query = "SELECT SCHEMA_NAME SchemaName FROM INFORMATION_SCHEMA.SCHEMATA";
                                    Parameters= []
                                        }


         


