import gql from 'graphql-tag';
import { GeneratedAppQuery, GeneratedAppQueryVariables } from 'src/domain/generated/types';
import { Query } from 'react-apollo';

const GENERATED_APP_QUERY = gql`
query GeneratedAppQuery($id: String!) {
    app(id: $id) {
      menuItems {
        name
        rank
      }
      pages {
        name
        table {
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
