import gql from "graphql-tag";
import { Query } from "react-apollo";
import {
  GetDbColumnsByTableNameQuery,
  GetDbColumnsByTableNameQueryVariables
} from "../../../domain/generated/types";

const DB_COLUMNS_BY_TABLE_QUERY = gql`
  query GetDbColumnsByTableName($tableName: String!) {
    columns(tableName: $tableName) {
      columnName
      schemaName
      tableName
      dataType
      isPrimaryKey
    }
  }
`;

class ColumsByTableQueryComponent extends Query<
  GetDbColumnsByTableNameQuery,
  GetDbColumnsByTableNameQueryVariables
> {}

export { DB_COLUMNS_BY_TABLE_QUERY, ColumsByTableQueryComponent };
