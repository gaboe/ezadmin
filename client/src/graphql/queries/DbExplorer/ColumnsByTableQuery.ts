import gql from "graphql-tag";
import { Query } from "react-apollo";
import {
  GetDbColumnsByTableNameQuery,
  GetDbColumnsByTableNameQueryVariables
} from "../../../generated-types/types";

const DB_COLUMNS_BY_TABLE_QUERY = gql`
  query GetDbColumnsByTableName($tableName: String!) {
    columns(tableName: $tableName) {
      columnName
      schemaName
      tableName
    }
  }
`;

class ColumsByTableQueryComponent extends Query<
  GetDbColumnsByTableNameQuery,
  GetDbColumnsByTableNameQueryVariables
> {}

export { DB_COLUMNS_BY_TABLE_QUERY, ColumsByTableQueryComponent };
