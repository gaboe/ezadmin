import gql from "graphql-tag";
import { DeleteEntityMutation, DeleteEntityMutationVariables } from "../../../domain/generated/types";
import { Mutation } from "react-apollo";

const DELETE_ENTITY_MUTATION = gql`
  mutation DeleteEntityMutation($appID: String!, $pageID: String!, $entityID: String!) {
    deleteEntity(appID: $appID, pageID: $pageID, entityID: $entityID) {
      wasDeleted
      message
    }
  }
`;

class DeleteEntityMutationComponent extends Mutation<DeleteEntityMutation, DeleteEntityMutationVariables>{ }

export { DELETE_ENTITY_MUTATION, DeleteEntityMutationComponent };
