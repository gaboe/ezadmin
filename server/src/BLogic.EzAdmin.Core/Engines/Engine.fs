namespace BLogic.EzAdmin.Core.Engines

module Engine =
    open BLogic.EzAdmin.Domain.UiTypes
    open BLogic.EzAdmin.Data.Engines
    open BLogic.EzAdmin.Domain.GraphQL
    open BLogic.EzAdmin.Domain.SchemaTypes
    open MongoDB.Bson

    let getApp (page: PageSchema) = 
        let isInAllowedColumns (column: Column) =
            page.Table.Columns 
                |> Seq.filter (fun e -> e.IsHidden |> not) 
                |> Seq.exists (fun e -> e.ColumnName = column.Name)

        let hideColumns (row: Row) = 
            let columns = row.Columns 
                            |> Seq.filter isInAllowedColumns 
                            |> Seq.toList
            { Key = row.Key; Columns = columns }

        let description = page.Table |> DescriptionConverter.convertToDescription
        
        let rows = description      
                    |> EngineRepository.getDynamicQueryResults
                    |> Seq.map hideColumns
                    |> Seq.toList

        let menuItems = [{Name = page.Name; Rank = 0}]

        let shownHeaders = [description.MainTable] @ description.JoinedTables
                            |> Seq.collect (fun e -> e.Columns)
                            |> Seq.where (fun e -> e.Column.IsHidden |> not)
                            |> Seq.map (fun e -> { Alias = e.ColumnAlias; Name = e.Column.ColumnName })
                            |> Seq.toList

        let pages = [{Name = page.Name; Table = {Rows = rows; Headers = shownHeaders }}]

        let preview = {MenuItems = menuItems; Pages = pages}
        preview

    let getAppPreview (input: AppInput) =

        let table = input |> AppInputTransformer.tranformToSchema 
        getApp {PageID = ObjectId.GenerateNewId(); Table = table; Name = input.tableTitle}
                           

