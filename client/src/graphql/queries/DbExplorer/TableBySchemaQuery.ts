import gql from "graphql-tag";
import { Query } from "react-apollo";
import {
  GetTablesBySchemaQuery,
  GetTablesBySchemaQueryVariables
} from "../../../generated-types/types";

const TABLES_BY_SCHEMA_QUERY = gql`
  query GetTablesBySchema($schemaName: String!) {
    tables(schemaName: $schemaName) {
      tableName
      schemaName
    }
  }
`;

class TablesBySchemaQueryComponent extends Query<
  GetTablesBySchemaQuery,
  GetTablesBySchemaQueryVariables
> {}

export { TABLES_BY_SCHEMA_QUERY, TablesBySchemaQueryComponent };
