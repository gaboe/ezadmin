namespace BLogic.EzAdmin.Core.Engines

module Engine =
    open BLogic.EzAdmin.Domain.UiTypes
    open BLogic.EzAdmin.Data.Engines
    open BLogic.EzAdmin.Domain.GraphQL

    let getAppPreview (input: AppInput) =

        let isInAllowedColumns column =
            input.columns 
                |> Seq.filter (fun e -> e.isHidden |> not) 
                |> Seq.exists (fun e -> e.columnName = column.Name)

        let hideColumns row = 
            let columns = row.Columns 
                            |> Seq.filter isInAllowedColumns 
                            |> Seq.toList
            { Key = row.Key; Columns = columns }

        let rows = input 
                    |> AppInputTransformer.tranformToSchema 
                    |> DescriptionConverter.convertToDescription
                    |> EngineRepository.getDynamicQueryResults
                    |> Seq.map hideColumns
                    |> Seq.toList

        let menuItems = [{Name = input.tableTitle; Rank = 0}]
        let pages = [{Table = {Rows = rows}}]

        let preview = {MenuItems = menuItems; Pages = pages}
        preview


