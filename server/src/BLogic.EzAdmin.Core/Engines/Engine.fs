namespace BLogic.EzAdmin.Core.Engines

module Engine =
    open BLogic.EzAdmin.Domain.UiTypes

    let _column: Column = {Name = "Hje"; Value = "1100"}
    let _row: Row = {Key= "1"; Columns= [_column]}
    let _table: Table = {Rows = [_row]}
    let _page: Page = {Table = _table}
    let _menuItem = {Rank = 1; Name = "Users"}
    let _app: App = {Pages = [ _page ]; MenuItems = [_menuItem]}

    let getAppPreview input = _app

