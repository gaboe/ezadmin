/* tslint:disable */
//  This file was automatically generated and should not be edited.

export interface GetColumnsByTableNameQueryVariables {
  tableName: string,
};

export interface GetColumnsByTableNameQuery {
  // Get table columns by table name
  columns:  Array< {
    __typename: "SqlColumn",
    // Column name
    columnName: string,
    // Schema name
    schemaName: string,
    // Table name
    tableName: string,
  } >,
};

export interface GetSchemasQuery {
  // Get db schemas
  schemas:  Array< {
    __typename: "SqlSchema",
    // Schema name
    schemaName: string,
  } >,
};

export interface GetTablesBySchemaQueryVariables {
  schemaName: string,
};

export interface GetTablesBySchemaQuery {
  // Get db tables by schema name
  tables:  Array< {
    __typename: "SqlTable",
    // Table name
    tableName: string,
    // Schema name
    schemaName: string,
  } >,
};
