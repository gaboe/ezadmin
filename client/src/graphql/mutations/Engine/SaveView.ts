import gql from "graphql-tag";

const SAVE_VIEW_MUTATION = gql`
  mutation SaveView($input: AppInput!) {
    saveView(input: $input) {
      cid
    }
  }
`;
export { SAVE_VIEW_MUTATION };
