import gql from "graphql-tag";
import { Query } from "react-apollo";
import { GetSchemasQuery } from "../../../generated-types/types";

const SCHEMAS_QUERY = gql`
  query GetSchemas {
    schemas {
      schemaName
    }
  }
`;

class SchemasQueryComponent extends Query<GetSchemasQuery> {}

export { SCHEMAS_QUERY, SchemasQueryComponent };
