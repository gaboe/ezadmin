import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { SignUpMutation, SignUpMutationVariables } from "../../../domain/generated/types";

const SIGN_UP_MUTATION = gql`
  mutation SignUpMutation($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
      token
      validationMessage
    }
  }
`;

class SignUpMutationComponent extends Mutation<SignUpMutation, SignUpMutationVariables>{ }

export { SIGN_UP_MUTATION, SignUpMutationComponent };
