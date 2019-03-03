namespace BLogic.EzAdmin.Domain.SchemaTypes

open MongoDB.Bson
open MongoDB.Bson.Serialization.Attributes

type [<CLIMutable>] MenuItemSchema = 
            {[<BsonId>] MenuItemID : ObjectId;
            Name: string;
            Rank: int;} 

type ColumnType = PrimaryKey | ForeignKey | Column

type [<CLIMutable>] ColumnSchema = 
            {[<BsonId>] ColumnID : ObjectId;
            ColumnName: string;
            TableName: string;
            SchemaName: string;
            ColumnType: ColumnType;
            IsHidden: bool;
            Reference: ColumnSchema option;
            } 

type [<CLIMutable>] TableSchema = 
            {[<BsonId>] TableID : ObjectId;
            SchemaName: string;
            TableName: string;
            Columns: ColumnSchema list} 

type [<CLIMutable>] PageSchema = 
            {[<BsonId>] PageID : ObjectId;
            Name: string;
            Table: TableSchema;} 

type [<CLIMutable>] AppSchema = 
            {[<BsonId>] AppID : ObjectId;
            UserID: ObjectId;
            Name: string;
            Connection: string;
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

