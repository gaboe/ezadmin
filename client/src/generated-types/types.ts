/* tslint:disable */
//  This file was automatically generated and should not be edited.

export enum SqlColumnDataType {
  char = "char",
  int = "int",
}


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
    } >,
  } | null,
};
