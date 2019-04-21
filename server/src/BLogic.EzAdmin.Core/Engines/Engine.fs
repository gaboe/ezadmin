namespace BLogic.EzAdmin.Core.Engines

module Engine =
    open BLogic.EzAdmin.Domain.UiTypes
    open BLogic.EzAdmin.Data.Engines
    open BLogic.EzAdmin.Domain.GraphQL
    open BLogic.EzAdmin.Domain.SchemaTypes
    open MongoDB.Bson

    let getVisibleColumns (table: TableSchema) resultRows = 
        let isInAllowedColumns (column: Column) =
            table.Columns 
                |> Seq.filter (fun e -> e.IsHidden |> not) 
                |> Seq.exists (fun e -> e.ColumnName = column.Name)

        let hideColumns (row: Row) = 
            let columns = row.Columns 
                            |> Seq.filter isInAllowedColumns 
                            |> Seq.toList
            { Key = row.Key; Columns = columns }

        let rows = resultRows |> Seq.map hideColumns |> Seq.toList
        rows

    let getApp offset limit (page: PageSchema) (connection: string) (menuItems: MenuItem list): App = 
        
        let description = page.Table |> DescriptionConverter.convertToDescription
        
        let (resultRows, count) = description |> EngineRepository.getDynamicQueryResults connection offset limit  

        let rows = getVisibleColumns page.Table resultRows 

        let shownHeaders = [description.MainTable] @ description.JoinedTables
                            |> Seq.collect (fun e -> e.Columns)
                            |> Seq.where (fun e -> e.Column.IsHidden |> not)
                            |> Seq.map (fun e -> { Alias = e.ColumnAlias; Name = e.Column.ColumnName })
                            |> Seq.toList

        let pages: Page list = [{ PageID = page.PageID.ToString(); Name = page.Name; Table = {Rows = rows; Headers = shownHeaders; AllRowsCount = count }}]

        let preview: App = {MenuItems = (menuItems |> Seq.sortBy (fun e -> e.Rank) |> Seq.toList); Pages = pages; Connection = connection}
        preview

    let getAppPreview (input: AppInput) (app: App) =

        let table = input |> AppInputTransformer.tranformToSchema 
        let page = {PageID = ObjectId.GenerateNewId(); Table = table; Name = input.tableTitle}
        let menuItems = (app.MenuItems) @ [{Name = input.tableTitle; Rank = int System.Int16.MaxValue; PageID = page.PageID.ToString()}]
        
        getApp 10 10 page input.connection menuItems

    let getEntity connection (page: PageSchema) entityID: Entity = 
        let table = page.Table
        let description = table |> DescriptionConverter.convertToDescription
    
        let resultRow = description |> EngineRepository.getDynamicQueryResult connection entityID

        let rows = getVisibleColumns table [resultRow]

        let columns = [description.MainTable] @ description.JoinedTables
                        |> Seq.collect (fun e -> e.Columns)
    
        let columnHeaders = rows.Head.Columns
                                            |> Seq.map (fun e -> let columnDesc = columns |> Seq.find(fun x -> x.ColumnAlias = e.ColumnAlias)
                                                                 { Column= e; ColumnID = columnDesc.Column.ColumnID.ToString()} )
                                            |> Seq.toList

        { EntityID = entityID;
          PageName = page.Name;
          Columns = columnHeaders; }


    let deleteEntity connection (table: TableSchema) entityID =
        let description = table |> DescriptionConverter.convertToDescription
        let result = EngineCommands.deleteEntity connection description entityID
        result

    let updateEntity connection (table: TableSchema) entityID columns = 
        let description = table |> DescriptionConverter.convertToDescription
        let result = EngineCommands.updateEntity connection description entityID columns
        result

        

    
        
                           

