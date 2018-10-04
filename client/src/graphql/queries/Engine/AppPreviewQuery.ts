import gql from "graphql-tag";
import { Query } from "react-apollo";
import {
  AppPreviewQuery,
  AppPreviewQueryVariables
} from "src/domain/generated/types";

const APP_PREVIEW_QUERY = gql`
  query AppPreview($input: AppInput!) {
    appPreview(input: $input) {
      menuItems {
        name
        rank
      }
      pages {
        table {
          rows {
            columns {
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
class AppPreviewComponent extends Query<
  AppPreviewQuery,
  AppPreviewQueryVariables
> {}
export { APP_PREVIEW_QUERY, AppPreviewComponent };
