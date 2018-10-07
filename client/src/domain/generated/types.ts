/* tslint:disable */
//  This file was automatically generated and should not be edited.

export enum SqlColumnDataType {
  Char = "Char",
  Int = "Int",
  Unknown = "Unknown",
}


export interface AppInput {
  tableTitle: string,
  schemaName: string,
  tableName: string,
  columns: Array< ColumnInput >,
};

export interface ColumnInput {
  schemaName: string,
  tableName: string,
  columnName: string,
  isPrimaryKey: boolean,
  isHidden: boolean,
  keyReference?: ColumnInput | null,
};

export interface GetDbColumnsByTableNameQueryVariables {
  tableName: string,
};

export interface GetDbColumnsByTableNameQuery {
  // Get table columns by table name
  columns:  Array< {
    __typename: "SqlColumn",
    // Column name
    columnName: string,
    // Schema name
    schemaName: string,
    // Table name
    tableName: string,
    dataType: SqlColumnDataType,
    // Column name
    isPrimaryKey: boolean,
  } >,
};

export interface GetDbSchemasQuery {
  // Get db schemas
  schemas:  Array< {
    __typename: "SqlSchema",
    // Schema name
    schemaName: string,
  } >,
};

export interface GetDbTablesBySchemaQueryVariables {
  schemaName: string,
};

export interface GetDbTablesBySchemaQuery {
  // Get db tables by schema name
  tables:  Array< {
    __typename: "SqlTable",
    // Table name
    tableName: string,
    // Schema name
    schemaName: string,
  } >,
};

export interface GetDbTableDetailQueryVariables {
  tableName: string,
};

export interface GetDbTableDetailQuery {
  // Get db table by table name
  table:  {
    __typename: "SqlTable",
    // Table name
    tableName: string,
    // Schema name
    schemaName: string,
    // Columns of table
    columns:  Array< {
      __typename: "SqlColumn",
      // Schema name
      schemaName: string,
      // Table name
      tableName: string,
      // Column name
      columnName: string,
      dataType: SqlColumnDataType,
      // Column name
      isPrimaryKey: boolean,
    } >,
    // Column references from this table to other tables
    referencesFromTable:  Array< {
      __typename: "SqlReference",
      // Name of reference
      referenceName: string,
      fromSchema: string,
      fromTable: string,
      fromColumn: string,
      toSchema: string,
      toTable: string,
      toColumn: string,
    } >,
    // Column references to this table
    referencesToTable:  Array< {
      __typename: "SqlReference",
      // Name of reference
      referenceName: string,
      fromSchema: string,
      fromTable: string,
      fromColumn: string,
      toSchema: string,
      toTable: string,
      toColumn: string,
    } >,
  } | null,
};

export interface AppPreviewQueryVariables {
  input: AppInput,
};

export interface AppPreviewQuery {
  // Return preview of app
  appPreview:  {
    __typename: "App",
    // Menu items
    menuItems:  Array< {
      __typename: "MenuItem",
      // Table on page
      name: string,
      // Table on page
      rank: number,
    } >,
    // Pages in app
    pages:  Array< {
      __typename: "Page",
      // Table on page
      table:  {
        __typename: "Table",
        // Rows in talbe
        rows:  Array< {
          __typename: "Row",
          // Multiple properties of record
          columns:  Array< {
            __typename: "Column",
            name: string,
            value: string,
          } >,
          // Represents unique key of row
          key: string,
        } >,
      },
    } >,
  },
};
