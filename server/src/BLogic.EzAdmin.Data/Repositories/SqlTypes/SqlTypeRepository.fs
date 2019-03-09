namespace BLogic.EzAdmin.Data.Repositories.SqlTypes

open BLogic.EzAdmin.Data.QueryHandler
open BLogic.EzAdmin.Domain.Sql
open BLogic.EzAdmin.Domain.SqlTypes

module SqlTypeRepository =
        let getAllSchemas connection = query<SqlSchema> {
                                    Query = "SELECT SCHEMA_NAME SchemaName FROM INFORMATION_SCHEMA.SCHEMATA ORDER BY SCHEMA_NAME";
                                    Parameters= []
                                    Connection = connection
                                        }

        let getTables schemaName connection = query<SqlTable> {
                                        Query = "SELECT TABLE_NAME TableName, TABLE_SCHEMA SchemaName FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = @SchemaName ORDER BY TABLE_NAME";
                                        Parameters = ["SchemaName", box schemaName]
                                        Connection = connection
                                        }

        let getTable schemaName tableName connection = querySingle<SqlTable> {
                                                Query = "SELECT TOP 1 TABLE_NAME TableName, TABLE_SCHEMA SchemaName FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = @SchemaName AND TABLE_NAME = @TableName";
                                                Parameters = [ "SchemaName", box schemaName; "TableName", box tableName]
                                                Connection = connection
                                                }

        let getColumns tableName connection = query<SqlColumn> {
                                                Query = """
                                                SELECT 
                                                [TABLE_SCHEMA] SchemaName,
                                                [TABLE_NAME] TableName, 
                                                [COLUMN_NAME] ColumnName, 
                                                [DATA_TYPE] DataType,
                                                CAST(
                                                    CASE WHEN EXISTS(SELECT 
                                                                i.name AS IndexName,
                                                                OBJECT_NAME(ic.OBJECT_ID) AS TableName,
                                                                COL_NAME(ic.OBJECT_ID,ic.column_id) AS ColumnName,
                                                                s.name AS [SchemaName]
                                                FROM sys.indexes AS i
                                                INNER JOIN sys.index_columns AS ic
                                                ON i.OBJECT_ID = ic.OBJECT_ID
                                                AND i.index_id = ic.index_id
                                                JOIN sys.objects o ON o.object_id = ic.object_id
                                                INNER JOIN sys.schemas s ON o.schema_id=s.schema_id

                                                WHERE i.is_primary_key = 1 AND s.name = [TABLE_SCHEMA] AND OBJECT_NAME(ic.OBJECT_ID) = [TABLE_NAME] AND  COL_NAME(ic.OBJECT_ID,ic.column_id) = [COLUMN_NAME])
                                                  THEN 1
                                                    ELSE 0
                                                  END
                                                 AS BIT) AS IsPrimaryKey  FROM INFORMATION_SCHEMA.COLUMNS

                                                 WHERE [TABLE_NAME] = @TableName
                                                """;
                                                Parameters = ["TableName", box tableName]
                                                Connection = connection
                                                }
