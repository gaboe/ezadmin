namespace BLogic.EzAdmin.Domain.UiTypes

type [<CLIMutable>] MenuItem = {Name: string; Rank: int}

type [<CLIMutable>] Column = {Name: string; Value: string;}

type [<CLIMutable>] Row = {Key: string; Columns: Column list;}

type [<CLIMutable>] Table = {Rows: Row list}

type [<CLIMutable>] Page = {Table: Table}

type [<CLIMutable>] App = {Pages: Page list; MenuItems: MenuItem list}


