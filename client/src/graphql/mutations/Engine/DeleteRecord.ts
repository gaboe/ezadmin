import gql from "graphql-tag";
import { DeleteRecordMutation, DeleteRecordMutationVariables } from "../../../domain/generated/types";
import { Mutation } from "react-apollo";

const DELETE_RECORD_MUTATION = gql`
  mutation DeleteRecordMutation($appID: String!, $pageID: String!, $recordKey: String!) {
    deleteRecord(appID: $appID, pageID: $pageID, recordKey: $recordKey) {
      wasDeleted
      message
    }
  }
`;

class DeleteRecordMutationComponent extends Mutation<DeleteRecordMutation, DeleteRecordMutationVariables>{ }

export { DELETE_RECORD_MUTATION, DeleteRecordMutationComponent };
