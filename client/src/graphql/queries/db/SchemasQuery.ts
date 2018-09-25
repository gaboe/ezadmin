import gql from "graphql-tag";

const SCHEMAS_QUERY = gql`
  query GetSchemas {
    schemas {
      schemaName
    }
  }
`;

export { SCHEMAS_QUERY };
