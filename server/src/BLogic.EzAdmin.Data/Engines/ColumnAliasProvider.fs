namespace BLogic.EzAdmin.Data.Engines

module ColumnAliasProvider =
    open BLogic.EzAdmin.Domain.SchemaTypes
    
    let mainTableAlias = "[MainTable]"

    let columnAlias (tableAlias: string) (column: ColumnSchema) = 
        let normalizedAlias = tableAlias.Replace("[","").Replace("]","")
        sprintf "%s_%s" normalizedAlias column.ColumnName


