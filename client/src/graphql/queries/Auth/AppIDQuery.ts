import gql from 'graphql-tag';
import { AppIDQuery } from 'src/domain/generated/types';
import { Query } from 'react-apollo';

const APPID_QUERY = gql`
query AppIDQuery{
    appID
  }
`;

class AppIDQueryComponent extends Query<AppIDQuery>{ }

export { APPID_QUERY, AppIDQueryComponent }