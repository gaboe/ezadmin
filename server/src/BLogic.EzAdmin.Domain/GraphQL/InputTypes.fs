namespace BLogic.EzAdmin.Domain.GraphQL

type ColumnInput = {schemaName: string;
                        tableName: string;
                        columnName: string;
                        isPrimaryKey: bool;
                        mainTableKeyColumnName: string option;}

type AppInput = {schemaName: string; tableName: string;}

