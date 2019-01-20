import gql from "graphql-tag";
import { Query } from "react-apollo";
import {
  GetDbTablesBySchema,
  GetDbTablesBySchemaVariables
} from "../../../domain/generated/types";

const DB_TABLES_BY_SCHEMA_QUERY = gql`
  query GetDbTablesBySchema($schemaName: String!) {
    tables(schemaName: $schemaName) {
      tableName
      schemaName
    }
  }
`;

class DbTablesBySchemaQueryComponent extends Query<
  GetDbTablesBySchema,
  GetDbTablesBySchemaVariables
> {}

export { DB_TABLES_BY_SCHEMA_QUERY, DbTablesBySchemaQueryComponent };
