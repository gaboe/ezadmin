import gql from 'graphql-tag';
import { DbTablesBySchemaQuery, DbTablesBySchemaQueryVariables } from '../../../domain/generated/types';
import { Query } from 'react-apollo';

const DB_TABLES_BY_SCHEMA_QUERY = gql`
  query DbTablesBySchemaQuery($schemaName: String!) {
    tables(schemaName: $schemaName) {
      tableName
      schemaName
    }
  }
`;

class DbTablesBySchemaQueryComponent extends Query<
  DbTablesBySchemaQuery,
  DbTablesBySchemaQueryVariables
  > { }

export { DB_TABLES_BY_SCHEMA_QUERY, DbTablesBySchemaQueryComponent };
