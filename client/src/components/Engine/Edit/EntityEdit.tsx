import * as React from "react";
import styled from "styled-components";
import { Divider, Header, Icon } from "semantic-ui-react";
import { ENTITY_QUERY, EntityQueryComponent } from "../../../graphql/queries/Engine/EntityQuery";
import { EntityForm } from "./EntityForm";

type Props = { pageID: string; entityID: string };

const Wrapper = styled.div`
    margin-top: 5em;
`

const EntityEdit: React.FunctionComponent<Props> = props => {
    const { pageID, entityID } = props;
    return (<Wrapper>

        <EntityQueryComponent variables={{ pageID, entityID }} query={ENTITY_QUERY}>
            {entityQuery => {
                if (entityQuery.data && entityQuery.data.entity) {
                    return (
                        <>
                            <Divider horizontal>
                                <Header as='h4'>
                                    <Icon name='edit' />
                                    Edit record from {entityQuery.data.entity.pageName}
                                </Header>
                            </Divider>
                            <EntityForm columns={entityQuery.data.entity.row.columns} />
                        </>
                    )
                }
                else return (<div>Loading ...</div>)
            }}
        </EntityQueryComponent>
    </Wrapper>)
}

export { EntityEdit };