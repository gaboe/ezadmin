import gql from "graphql-tag";
import { CreateApplicationMutation, CreateApplicationMutationVariables } from "../../../domain/generated/types";
import { Mutation } from "react-apollo";

const CREATE_APPLICATION_MUTATION = gql`
mutation CreateApplicationMutation($name: String!, $connection: String!) {
    createApplication(name: $name, connection: $connection) {
      message
    }
  }
`;

class CreateApplicationMutationComponent extends Mutation<CreateApplicationMutation, CreateApplicationMutationVariables>{ }

export { CREATE_APPLICATION_MUTATION, CreateApplicationMutationComponent };
