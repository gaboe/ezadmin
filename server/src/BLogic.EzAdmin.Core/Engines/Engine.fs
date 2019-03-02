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

        let description = input 
                            |> AppInputTransformer.tranformToSchema 
                            |> DescriptionConverter.convertToDescription
        
        let rows = description      
                    |> EngineRepository.getDynamicQueryResults
                    |> Seq.map hideColumns
                    |> Seq.toList

        let menuItems = [{Name = input.tableTitle; Rank = 0}]

        let shownHeaders = [description.MainTable] @ description.JoinedTables
                            |> Seq.collect (fun e -> e.Columns)
                            |> Seq.where (fun e -> e.Column.IsHidden |> not)
                            |> Seq.map (fun e -> e.Column.ColumnName)
                            |> Seq.toList

        let pages = [{Table = {Rows = rows; Headers = shownHeaders }}]

        let preview = {MenuItems = menuItems; Pages = pages}
        preview


