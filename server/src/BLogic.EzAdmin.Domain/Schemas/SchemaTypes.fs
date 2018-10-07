namespace BLogic.EzAdmin.Domain.SchemaTypes

open MongoDB.Bson

type [<CLIMutable>] MenuItemSchema = 
            {[<DefaultValue>] MenuItemID : BsonObjectId;
            Name: string;
            Rank: int;} 

type KeyType = PrimaryKey | ForeignKey | None

type [<CLIMutable>] ColumnSchema = 
            {[<DefaultValue>] ColumnID : BsonObjectId;
            ColumnName: string;
            TableName: string;
            SchemaName: string;
            KeyType: KeyType;
            IsHidden: bool;
            Reference: ColumnSchema option;
            } 

type [<CLIMutable>] TableSchema = 
            {[<DefaultValue>] TableID : BsonObjectId;
            SchemaName: string;
            TableName: string;
            Columns: ColumnSchema list} 

type [<CLIMutable>] PageSchema = 
            {[<DefaultValue>] PageID : BsonObjectId;
            Name: string;
            Table: TableSchema;} 

type [<CLIMutable>] AppSchema = 
            {[<DefaultValue>] AppID : BsonObjectId;
            MenuItems: MenuItemSchema list;
            Pages: PageSchema list} 

type ColumnQueryDescription = { TableAlias: string;
                                Column: ColumnSchema
                              }

type TableQueryDescriptionType = Primary | Foreign

type TableQueryDescription = {  TableAlias: string;
                                SchemaName: string;
                                TableName: string;
                                Type: TableQueryDescriptionType;
                                Columns: ColumnQueryDescription list;
                              }

type QueryDescription = {TableQueryDescriptions: TableQueryDescription list;}

