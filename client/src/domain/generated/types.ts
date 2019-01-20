/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Login
// ====================================================

export interface Login_login {
  __typename: "LoginResult";
  /**
   * Token
   */
  token: string | null;
}

export interface Login {
  /**
   * If succesfull returns token
   */
  login: Login_login;
}

export interface LoginVariables {
  email: string;
  password: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetDbColumnsByTableName
// ====================================================

export interface GetDbColumnsByTableName_columns {
  __typename: "SqlColumn";
  /**
   * Column name
   */
  columnName: string;
  /**
   * Schema name
   */
  schemaName: string;
  /**
   * Table name
   */
  tableName: string;
  dataType: SqlColumnDataType;
  /**
   * Column name
   */
  isPrimaryKey: boolean;
}

export interface GetDbColumnsByTableName {
  /**
   * Get table columns by table name
   */
  columns: GetDbColumnsByTableName_columns[];
}

export interface GetDbColumnsByTableNameVariables {
  tableName: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetDbSchemas
// ====================================================

export interface GetDbSchemas_schemas {
  __typename: "SqlSchema";
  /**
   * Schema name
   */
  schemaName: string;
}

export interface GetDbSchemas {
  /**
   * Get db schemas
   */
  schemas: GetDbSchemas_schemas[];
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetDbTablesBySchema
// ====================================================

export interface GetDbTablesBySchema_tables {
  __typename: "SqlTable";
  /**
   * Table name
   */
  tableName: string;
  /**
   * Schema name
   */
  schemaName: string;
}

export interface GetDbTablesBySchema {
  /**
   * Get db tables by schema name
   */
  tables: GetDbTablesBySchema_tables[];
}

export interface GetDbTablesBySchemaVariables {
  schemaName: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetDbTableDetail
// ====================================================

export interface GetDbTableDetail_table_columns {
  __typename: "SqlColumn";
  /**
   * Schema name
   */
  schemaName: string;
  /**
   * Table name
   */
  tableName: string;
  /**
   * Column name
   */
  columnName: string;
  dataType: SqlColumnDataType;
  /**
   * Column name
   */
  isPrimaryKey: boolean;
}

export interface GetDbTableDetail_table_referencesFromTable {
  __typename: "SqlReference";
  /**
   * Name of reference
   */
  referenceName: string;
  fromSchema: string;
  fromTable: string;
  fromColumn: string;
  toSchema: string;
  toTable: string;
  toColumn: string;
}

export interface GetDbTableDetail_table_referencesToTable {
  __typename: "SqlReference";
  /**
   * Name of reference
   */
  referenceName: string;
  fromSchema: string;
  fromTable: string;
  fromColumn: string;
  toSchema: string;
  toTable: string;
  toColumn: string;
}

export interface GetDbTableDetail_table {
  __typename: "SqlTable";
  /**
   * Table name
   */
  tableName: string;
  /**
   * Schema name
   */
  schemaName: string;
  /**
   * Columns of table
   */
  columns: GetDbTableDetail_table_columns[];
  /**
   * Column references from this table to other tables
   */
  referencesFromTable: GetDbTableDetail_table_referencesFromTable[];
  /**
   * Column references to this table
   */
  referencesToTable: GetDbTableDetail_table_referencesToTable[];
}

export interface GetDbTableDetail {
  /**
   * Get db table by table name
   */
  table: GetDbTableDetail_table | null;
}

export interface GetDbTableDetailVariables {
  tableName: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AppPreview
// ====================================================

export interface AppPreview_appPreview_menuItems {
  __typename: "MenuItem";
  /**
   * Table on page
   */
  name: string;
  /**
   * Table on page
   */
  rank: number;
}

export interface AppPreview_appPreview_pages_table_rows_columns {
  __typename: "Column";
  name: string;
  value: string;
}

export interface AppPreview_appPreview_pages_table_rows {
  __typename: "Row";
  /**
   * Multiple properties of record
   */
  columns: AppPreview_appPreview_pages_table_rows_columns[];
  /**
   * Represents unique key of row
   */
  key: string;
}

export interface AppPreview_appPreview_pages_table {
  __typename: "Table";
  /**
   * Rows in talbe
   */
  rows: AppPreview_appPreview_pages_table_rows[];
}

export interface AppPreview_appPreview_pages {
  __typename: "Page";
  /**
   * Table on page
   */
  table: AppPreview_appPreview_pages_table;
}

export interface AppPreview_appPreview {
  __typename: "App";
  /**
   * Menu items
   */
  menuItems: AppPreview_appPreview_menuItems[];
  /**
   * Pages in app
   */
  pages: AppPreview_appPreview_pages[];
}

export interface AppPreview {
  /**
   * Return preview of app
   */
  appPreview: AppPreview_appPreview;
}

export interface AppPreviewVariables {
  input: AppInput;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum SqlColumnDataType {
  Char = "Char",
  Int = "Int",
  Unknown = "Unknown",
}

export interface AppInput {
  tableTitle: string;
  schemaName: string;
  tableName: string;
  columns: ColumnInput[];
}

export interface ColumnInput {
  schemaName: string;
  tableName: string;
  columnName: string;
  isPrimaryKey: boolean;
  isHidden: boolean;
  keyReference?: ColumnInput | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
