import gql from "graphql-tag";
import { GeneratedAppQuery, GeneratedAppQueryVariables } from "../../../domain/generated/types";
import { Query } from "react-apollo";

const GENERATED_APP_QUERY = gql`
query GeneratedAppQuery($id: String!, $pageID: String, $offset: Int!, $limit: Int!) {
  app(id: $id, pageID: $pageID, offset: $offset, limit: $limit) {
    menuItems {
      name
      rank
      pageID
    }
    pages {
      pageID
      name
      table {
        allRowsCount
        headers {
          alias
          name
        }
        rows {
          columns {
            columnAlias
            name
            value
          }
          key
        }
      }
    }
  }
}
`;

class GeneratedAppQueryComponent extends Query<GeneratedAppQuery, GeneratedAppQueryVariables> { }

export { GENERATED_APP_QUERY, GeneratedAppQueryComponent };
