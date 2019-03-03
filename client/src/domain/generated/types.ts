/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LoginMutation
// ====================================================

export interface LoginMutation_login {
  __typename: "LoginResult";
  /**
   * Token
   */
  token: string | null;
}

export interface LoginMutation {
  /**
   * If succesfull returns token
   */
  login: LoginMutation_login;
}

export interface LoginMutationVariables {
  email: string;
  password: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SaveViewMutation
// ====================================================

export interface SaveViewMutation_saveView {
  __typename: "SaveViewResult";
  /**
   * Cid
   */
  cid: string;
}

export interface SaveViewMutation {
  /**
   * Saves designed view
   */
  saveView: SaveViewMutation_saveView;
}

export interface SaveViewMutationVariables {
  input: AppInput;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DbColumnsByTableNameQuery
// ====================================================

export interface DbColumnsByTableNameQuery_columns {
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

export interface DbColumnsByTableNameQuery {
  /**
   * Get table columns by table name
   */
  columns: DbColumnsByTableNameQuery_columns[];
}

export interface DbColumnsByTableNameQueryVariables {
  tableName: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DbSchemasQuery
// ====================================================

export interface DbSchemasQuery_schemas {
  __typename: "SqlSchema";
  /**
   * Schema name
   */
  schemaName: string;
}

export interface DbSchemasQuery {
  /**
   * Get db schemas
   */
  schemas: DbSchemasQuery_schemas[];
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DbTablesBySchemaQuery
// ====================================================

export interface DbTablesBySchemaQuery_tables {
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

export interface DbTablesBySchemaQuery {
  /**
   * Get db tables by schema name
   */
  tables: DbTablesBySchemaQuery_tables[];
}

export interface DbTablesBySchemaQueryVariables {
  schemaName: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DbTableDetailQuery
// ====================================================

export interface DbTableDetailQuery_table_columns {
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

export interface DbTableDetailQuery_table_referencesFromTable {
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

export interface DbTableDetailQuery_table_referencesToTable {
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

export interface DbTableDetailQuery_table {
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
  columns: DbTableDetailQuery_table_columns[];
  /**
   * Column references from this table to other tables
   */
  referencesFromTable: DbTableDetailQuery_table_referencesFromTable[];
  /**
   * Column references to this table
   */
  referencesToTable: DbTableDetailQuery_table_referencesToTable[];
}

export interface DbTableDetailQuery {
  /**
   * Get db table by table name
   */
  table: DbTableDetailQuery_table | null;
}

export interface DbTableDetailQueryVariables {
  schemaName: string;
  tableName: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AppPreviewQuery
// ====================================================

export interface AppPreviewQuery_appPreview_menuItems {
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

export interface AppPreviewQuery_appPreview_pages_table_headers {
  __typename: "Header";
  alias: string;
  name: string;
}

export interface AppPreviewQuery_appPreview_pages_table_rows_columns {
  __typename: "Column";
  columnAlias: string;
  name: string;
  value: string;
}

export interface AppPreviewQuery_appPreview_pages_table_rows {
  __typename: "Row";
  /**
   * Multiple properties of record
   */
  columns: AppPreviewQuery_appPreview_pages_table_rows_columns[];
  /**
   * Represents unique key of row
   */
  key: string;
}

export interface AppPreviewQuery_appPreview_pages_table {
  __typename: "Table";
  /**
   * Headers
   */
  headers: AppPreviewQuery_appPreview_pages_table_headers[];
  /**
   * Rows in talbe
   */
  rows: AppPreviewQuery_appPreview_pages_table_rows[];
}

export interface AppPreviewQuery_appPreview_pages {
  __typename: "Page";
  /**
   * Name
   */
  name: string;
  /**
   * Table on page
   */
  table: AppPreviewQuery_appPreview_pages_table;
}

export interface AppPreviewQuery_appPreview {
  __typename: "App";
  /**
   * Menu items
   */
  menuItems: AppPreviewQuery_appPreview_menuItems[];
  /**
   * Pages in app
   */
  pages: AppPreviewQuery_appPreview_pages[];
}

export interface AppPreviewQuery {
  /**
   * Return preview of app
   */
  appPreview: AppPreviewQuery_appPreview;
}

export interface AppPreviewQueryVariables {
  input: AppInput;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GeneratedAppQuery
// ====================================================

export interface GeneratedAppQuery_app_menuItems {
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

export interface GeneratedAppQuery_app_pages_table_headers {
  __typename: "Header";
  alias: string;
  name: string;
}

export interface GeneratedAppQuery_app_pages_table_rows_columns {
  __typename: "Column";
  columnAlias: string;
  name: string;
  value: string;
}

export interface GeneratedAppQuery_app_pages_table_rows {
  __typename: "Row";
  /**
   * Multiple properties of record
   */
  columns: GeneratedAppQuery_app_pages_table_rows_columns[];
  /**
   * Represents unique key of row
   */
  key: string;
}

export interface GeneratedAppQuery_app_pages_table {
  __typename: "Table";
  /**
   * Headers
   */
  headers: GeneratedAppQuery_app_pages_table_headers[];
  /**
   * Rows in talbe
   */
  rows: GeneratedAppQuery_app_pages_table_rows[];
}

export interface GeneratedAppQuery_app_pages {
  __typename: "Page";
  /**
   * Name
   */
  name: string;
  /**
   * Table on page
   */
  table: GeneratedAppQuery_app_pages_table;
}

export interface GeneratedAppQuery_app {
  __typename: "App";
  /**
   * Menu items
   */
  menuItems: GeneratedAppQuery_app_menuItems[];
  /**
   * Pages in app
   */
  pages: GeneratedAppQuery_app_pages[];
}

export interface GeneratedAppQuery {
  /**
   * Returns application
   */
  app: GeneratedAppQuery_app;
}

export interface GeneratedAppQueryVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
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
