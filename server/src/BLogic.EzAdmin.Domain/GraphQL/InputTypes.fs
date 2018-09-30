namespace BLogic.EzAdmin.Domain.GraphQL

module InputTypes = 
    type ColumnInput = {schemaName: string;
                        tableName: string;
                        columnName: string;
                        isKey: bool;
                        primaryKeyName: string option;}

    type AppInput = {schemaName: string; tableName: string;}
    

