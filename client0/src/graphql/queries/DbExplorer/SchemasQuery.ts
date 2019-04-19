import gql from 'graphql-tag';
import { DbSchemasQuery } from '../../../domain/generated/types';
import { Query } from 'react-apollo';

const DB_SCHEMAS_QUERY = gql`
  query DbSchemasQuery{
    schemas {
      schemaName
    }
  }
`;

class DbSchemasQueryComponent extends Query<DbSchemasQuery> { }

export { DB_SCHEMAS_QUERY, DbSchemasQueryComponent };
