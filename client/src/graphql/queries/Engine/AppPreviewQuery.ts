import gql from "graphql-tag";
import { Query } from "react-apollo";
import { AppPreview, AppPreviewVariables } from "src/domain/generated/types";

const APP_PREVIEW_QUERY = gql`
  query AppPreview($input: AppInput!) {
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
class AppPreviewComponent extends Query<AppPreview, AppPreviewVariables> { }
export { APP_PREVIEW_QUERY, AppPreviewComponent };
