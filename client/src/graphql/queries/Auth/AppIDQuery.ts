import gql from "graphql-tag";
import { AppIDQuery } from "../../../domain/generated/types";
import { Query } from "react-apollo";

const APPID_QUERY = gql`
	query AppIDQuery {
		currentApp {
			appID
			name
			connection
			firstAppID
		}
	}
`;

class AppIDQueryComponent extends Query<AppIDQuery> {}

export { APPID_QUERY, AppIDQueryComponent };
