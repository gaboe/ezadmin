namespace BLogic.EzAdmin.Core.Engines

module Engine =
    open BLogic.EzAdmin.Domain.UiTypes
    open BLogic.EzAdmin.Data.Engines
    open BLogic.EzAdmin.Domain.GraphQL

    let _column: Column = {Name = "Hje"; Value = "1100"}
    let _row: Row = {Key= "1"; Columns= [_column]}
    let _table: Table = {Rows = [_row]}
    let _page: Page = {Table = _table}
    let _menuItem = {Rank = 1; Name = "Users"}
    let _app: App = {Pages = [ _page ]; MenuItems = [_menuItem]}

    let getAppPreview (input: AppInput) =

        let allowedColumns =
            input.columns 
                |> Seq.filter (fun e -> e.isHidden |> not) 
                |> Seq.toList

        let isInAllowedColumns column =
                allowedColumns
                |> Seq.exists (fun e -> e.columnName = column.Name)

        let hideColumns row = 
            let columns = row.Columns |> Seq.filter isInAllowedColumns |> Seq.toList
            { Key = row.Key; Columns = columns }

        let rows = input 
                    |> AppPreviewTransformer.tranformToSchema 
                    |> EngineRepository.getDynamicQueryResults
                    |> Seq.map hideColumns
                    |> Seq.toList

        let menuItems = [{Name = input.tableTitle; Rank = 0}]
        let pages = [{Table = {Rows = rows}}]

        let preview = {MenuItems = menuItems; Pages = pages}
        preview


