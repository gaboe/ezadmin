import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { UpdateEntityMutation, UpdateEntityMutationVariables } from "../../../domain/generated/types";

const UPDATE_ENTITY_MUTATION = gql`
  mutation UpdateEntityMutation($input: UpdateEntityInput!) {
    updateEntity(input: $input) {
      wasUpdated
      message
    }
  }
`;

class UpdateEntityMutationComponent extends Mutation<UpdateEntityMutation, UpdateEntityMutationVariables>{ }

export { UPDATE_ENTITY_MUTATION, UpdateEntityMutationComponent };
