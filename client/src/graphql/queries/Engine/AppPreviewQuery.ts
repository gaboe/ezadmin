import gql from 'graphql-tag';
import { AppPreviewQuery, AppPreviewQueryVariables } from 'src/domain/generated/types';
import { Query } from 'react-apollo';

const APP_PREVIEW_QUERY = gql`
  query AppPreviewQuery($input: AppInput!) {
    appPreview(input: $input) {
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

class AppPreviewQueryComponent extends Query<AppPreviewQuery, AppPreviewQueryVariables> { }

export { APP_PREVIEW_QUERY, AppPreviewQueryComponent };
