import gql from 'graphql-tag';
import { DbTableDetailQuery, DbTableDetailQueryVariables } from '../../../domain/generated/types';
import { Query } from 'react-apollo';

const DB_TABLE_DETAIL_QUERY = gql`
  query DbTableDetailQuery($schemaName: String!, $tableName: String!) {
    table(schemaName: $schemaName, tableName: $tableName) {
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
  DbTableDetailQuery,
  DbTableDetailQueryVariables
  > { }

export { DB_TABLE_DETAIL_QUERY, DbTablesDetailQueryComponent };
