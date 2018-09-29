namespace BLogic.EzAdmin.Domain.SqlTypes

type [<CLIMutable>] SqlSchema = 
    {SchemaName: string;}

type [<CLIMutable>] SqlTable = 
    {TableName: string;
    SchemaName: string;} 

type [<CLIMutable>] SqlColumn =
    {ColumnName: string;
    TableName: string;
    SchemaName: string;
    DataType: string;
    IsPrimaryKey: bool;}

type [<CLIMutable>] SqlReference =
    {ReferenceName: string;
    FromSchema: string;
    FromTable: string;
    FromColumn: string;
    ToSchema: string;
    ToTable: string;
    ToColumn: string;}
