import gql from "graphql-tag";
import { Query } from "react-apollo";
import { UserApplicationQuery } from "../../../domain/generated/types";

const USER_APPLICATIONS_QUERY = gql`
query UserApplicationQuery{
    userApplications{
      appID  
      name
      connection
    }
  }
`;

class UserApplicationsQueryComponent extends Query<UserApplicationQuery>{ }

export { USER_APPLICATIONS_QUERY, UserApplicationsQueryComponent }