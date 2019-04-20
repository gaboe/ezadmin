import * as React from "react";
import { ENTITY_QUERY, EntityQueryComponent } from "../../../graphql/queries/Engine/EntityQuery";
import { RouteComponentProps } from "react-router";

type Props = RouteComponentProps<{ pageID: string; entityID: string }>;

const EntityEdit: React.FunctionComponent<Props> = props => {
    const { pageID, entityID } = props.match.params;
    return (<>
        <EntityQueryComponent variables={{ pageID, entityID }} query={ENTITY_QUERY}>
            {entityQuery => {
                if (entityQuery.data && entityQuery.data.entity) {
                    return (<>Noice</>)
                }
                else return (<div>Loading ...</div>)
            }}
        </EntityQueryComponent>
    </>)
}

export { EntityEdit };