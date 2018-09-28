import gql from "graphql-tag";
import { Query } from "react-apollo";
import { GetDbSchemasQuery } from "../../../generated-types/types";

const DB_SCHEMAS_QUERY = gql`
  query GetDbSchemas {
    schemas {
      schemaName
    }
  }
`;

class DbSchemasQueryComponent extends Query<GetDbSchemasQuery> {}

export { DB_SCHEMAS_QUERY, DbSchemasQueryComponent };
