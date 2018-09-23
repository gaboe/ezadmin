namespace BLogic.EzAdmin.Domain.SqlTypes

type [<CLIMutable>] SqlSchema = 
    {SchemaName: string;}

type [<CLIMutable>] SqlTable = 
    {Name: string;
    SchemaName: string;} 

type [<CLIMutable>] SqlColumn =
    {ColumnName: string;
    TableName: string;
    SchemaName: string;}
