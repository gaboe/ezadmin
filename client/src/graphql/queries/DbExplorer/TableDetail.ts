import gql from "graphql-tag";
import { Query } from "react-apollo";
import {
  GetDbTableDetail,
  GetDbTableDetailVariables
} from "../../../domain/generated/types";

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
        isPrimaryKey
      }
      referencesFromTable {
        referenceName
        fromSchema
        fromTable
        fromColumn
        toSchema
        toTable
        toColumn
      }
      referencesToTable {
        referenceName
        fromSchema
        fromTable
        fromColumn
        toSchema
        toTable
        toColumn
      }
    }
  }
`;
class DbTablesDetailQueryComponent extends Query<
  GetDbTableDetail,
  GetDbTableDetailVariables
> {}

export { DB_TABLE_DETAIL_QUERY, DbTablesDetailQueryComponent };
