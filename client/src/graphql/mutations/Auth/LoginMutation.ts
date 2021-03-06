import gql from "graphql-tag";
import { LoginMutation, LoginMutationVariables } from "../../../domain/generated/types";
import { Mutation } from "react-apollo";

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      validationMessage
    }
  }
`;

class LoginMutationComponent extends Mutation<LoginMutation, LoginMutationVariables>{ }

export { LOGIN_MUTATION, LoginMutationComponent };
