import gql from 'graphql-tag';
import { App, AppVariables } from 'src/domain/generated/types';
import { Query } from 'react-apollo';
const APP_QUERY = gql`
query App($id: String!) {
    app(id: $id) {
      menuItems {
        name
        rank
      }
      pages {
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

class AppComponent extends Query<App, AppVariables> { }

export { APP_QUERY, AppComponent };
