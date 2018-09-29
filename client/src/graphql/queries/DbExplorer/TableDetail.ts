import gql from "graphql-tag";
import { Query } from "react-apollo";
import {
  GetDbTableDetailQuery,
  GetDbTableDetailQueryVariables
} from "../../../generated-types/types";

const DB_TABLE_DETAIL_QUERY = gql`
  query GetDbTableDetail($tableName: String!) {
    table(tableName: $tableName) {
      tableName
      schemaName
      columns {
        schemaName
        tableName
        columnName
        dataType
      }
      referencesFromTable {
        referenceName
        fromSchema
        fromTable
        fromColumn
        toSchema
        toTable
        toSchema
      }
      referencesToTable {
        referenceName
        fromSchema
        fromTable
        fromColumn
        toSchema
        toTable
        toSchema
      }
    }
  }
`;
class DbTablesDetailQueryComponent extends Query<
  GetDbTableDetailQuery,
  GetDbTableDetailQueryVariables
> {}

export { DB_TABLE_DETAIL_QUERY, DbTablesDetailQueryComponent };
