namespace BLogic.EzAdmin.Core.Services.Application

module ApplicationService =
    open BLogic.EzAdmin.Domain.GraphQL
    open BLogic.EzAdmin.Domain.SchemaTypes
    open BLogic.EzAdmin.Core.Engines

    let saveView (input: AppInput) = 
        let app: AppSchema = { MenuItems = [{Name = input.tableTitle; Rank = 0}];
                                Pages = [
                                    {Name = input.tableTitle;
                                    Table = AppInputTransformer.tranformToSchema input }]}
        "cid"

    

