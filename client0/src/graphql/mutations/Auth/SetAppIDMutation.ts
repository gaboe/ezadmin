import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { SetAppIDMutation, SetAppIDMutationVariables } from 'src/domain/generated/types';

const SET_APPID_MUTATION = gql`
  mutation SetAppIDMutation($appID: String!) {
    setAppID(appID: $appID) {
      token
    }
  }
`;

class SetAppIDMutationComponent extends Mutation<SetAppIDMutation, SetAppIDMutationVariables>{ }

export { SET_APPID_MUTATION, SetAppIDMutationComponent };
