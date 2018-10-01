namespace BLogic.EzAdmin.Domain.GraphQL.InputTypes

type ColumnInput = {schemaName: string;
                        tableName: string;
                        columnName: string;
                        isPrimaryKey: bool;
                        mainTableKeyColumnName: string option;}

type AppInput = {schemaName: string; tableName: string;}
    

