namespace BLogic.EzAdmin.Domain.SchemaTypes

open MongoDB.Bson

type [<CLIMutable>] MenuItemSchema = 
            {[<DefaultValue>] MenuItemID : BsonObjectId;
            Name: string;
            Rank: int;} 

type ColumnType = PrimaryKey | ForeignKey | Column

type [<CLIMutable>] ColumnSchema = 
            {[<DefaultValue>] ColumnID : BsonObjectId;
            ColumnName: string;
            TableName: string;
            SchemaName: string;
            ColumnType: ColumnType;
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

type ColumnQueryDescription = { Column: ColumnSchema; 
                                TableAlias: string;
                                ColumnAlias: string;
                              }

type TableQueryDescriptionType = Primary | Foreign

type TableQueryDescription = {  TableAlias: string;
                                SchemaName: string;
                                TableName: string;
                                Type: TableQueryDescriptionType;
                                Columns: ColumnQueryDescription list;
                              }

type QueryDescription = {   MainTable: TableQueryDescription;
                            JoinedTables:  TableQueryDescription list;}

