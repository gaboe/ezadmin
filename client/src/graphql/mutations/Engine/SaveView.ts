import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import {
	SaveViewMutation,
	SaveViewMutationVariables
} from "../../../domain/generated/types";

const SAVE_VIEW_MUTATION = gql`
	mutation SaveViewMutation($input: AppInput!) {
		saveView(input: $input) {
			pageID
		}
	}
`;

class SaveViewMutationComponent extends Mutation<
	SaveViewMutation,
	SaveViewMutationVariables
> {}

export { SAVE_VIEW_MUTATION, SaveViewMutationComponent };
