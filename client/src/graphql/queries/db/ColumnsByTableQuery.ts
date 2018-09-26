import gql from "graphql-tag";
import { Query } from "react-apollo";
import {
  GetColumnsByTableNameQuery,
  GetColumnsByTableNameQueryVariables
} from "../../../generated-types/types";

const COLUMNS_BY_TABLE_QUERY = gql`
  query GetColumnsByTableName($tableName: String!) {
    columns(tableName: $tableName) {
      columnName
      schemaName
      tableName
    }
  }
`;

class ColumsByTableQueryComponent extends Query<
  GetColumnsByTableNameQuery,
  GetColumnsByTableNameQueryVariables
> {}

export { COLUMNS_BY_TABLE_QUERY, ColumsByTableQueryComponent };
