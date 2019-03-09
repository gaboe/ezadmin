namespace BLogic.EzAdmin.Domain.UiTypes

type [<CLIMutable>] MenuItem = {Name: string; Rank: int}

type [<CLIMutable>] Column = {Name: string; ColumnAlias: string; Value: string;}

type [<CLIMutable>] Row = {Key: string; Columns: Column list;}

type [<CLIMutable>] Header = {Name: string; Alias: string;}

type [<CLIMutable>] Table = {Rows: Row list; Headers: Header list}

type [<CLIMutable>] Page = {Table: Table; Name: string}

type [<CLIMutable>] App = {Pages: Page list; MenuItems: MenuItem list; Connection: string}

type [<CLIMutable>] UserApp = {AppID:string; Name: string; Connection: string}