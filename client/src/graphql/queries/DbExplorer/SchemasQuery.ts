import gql from "graphql-tag";
import { Query } from "react-apollo";
import { GetDbSchemas } from "../../../domain/generated/types";

const DB_SCHEMAS_QUERY = gql`
  query GetDbSchemas {
    schemas {
      schemaName
    }
  }
`;

class DbSchemasQueryComponent extends Query<GetDbSchemas> {}

export { DB_SCHEMAS_QUERY, DbSchemasQueryComponent };
