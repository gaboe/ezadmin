namespace BLogic.EzAdmin.Data.Repositories.SqlTypes

open BLogic.EzAdmin.Data.QueryHandler
open BLogic.EzAdmin.Domain.Sql
open BLogic.EzAdmin.Domain.SqlTypes

module SqlTypeRepository =
        let getAllSchemas = query<SqlSchema> {
                                    Query = "SELECT SCHEMA_NAME SchemaName FROM INFORMATION_SCHEMA.SCHEMATA";
                                    Parameters= []
                                        }

        let getTables schemaName = query<SqlTable> {
                                        Query = "SELECT TABLE_NAME TableName, TABLE_SCHEMA SchemaName FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = @SchemaName";
                                        Parameters = ["SchemaName", box schemaName]
                                        }

        let getTable tableName = querySingle<SqlTable> {
                                                Query = "SELECT TOP 1 TABLE_NAME TableName, TABLE_SCHEMA SchemaName FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = @TableName";
                                                Parameters = ["TableName", box tableName]
                                                }

         


