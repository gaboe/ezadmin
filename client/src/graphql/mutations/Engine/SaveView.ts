import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { SaveViewMutation, SaveViewMutationVariables } from 'src/domain/generated/types';
const SAVE_VIEW_MUTATION = gql`
  mutation SaveViewMutation($input: AppInput!) {
    saveView(input: $input) {
      cid
    }
  }
`;

class SaveViewMutationComponent extends Mutation<SaveViewMutation, SaveViewMutationVariables>{ }

export { SAVE_VIEW_MUTATION, SaveViewMutationComponent };
