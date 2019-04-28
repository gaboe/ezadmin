import gql from 'graphql-tag';
import { DbColumnsByTableNameQuery, DbColumnsByTableNameQueryVariables } from '../../../domain/generated/types';
import { Query } from 'react-apollo';

const DB_COLUMNS_BY_TABLE_QUERY = gql`
  query DbColumnsByTableNameQuery($tableName: String!) {
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
  DbColumnsByTableNameQuery,
  DbColumnsByTableNameQueryVariables
  > { }

export { DB_COLUMNS_BY_TABLE_QUERY, ColumsByTableQueryComponent };
