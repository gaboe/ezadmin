import gql from "graphql-tag";
import { EntityQuery, EntityQueryVariables } from "../../../domain/generated/types";
import { Query } from "react-apollo";

const ENTITY_QUERY = gql`
query EntityQuery($pageID: String!, $entityID: String!) {
  entity(pageID: $pageID, entityID: $entityID) {
    entityID
    pageName
    columns {
      columnID
      column {
        columnAlias
        name
        value
      }
    }
  }
}

`;

class EntityQueryComponent extends Query<EntityQuery, EntityQueryVariables> { }

export { ENTITY_QUERY, EntityQueryComponent };
