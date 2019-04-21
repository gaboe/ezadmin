import * as R from "ramda";
import * as React from "react";
import styled from "styled-components";
import { Divider, Header, Icon } from "semantic-ui-react";
import { ENTITY_QUERY, EntityQueryComponent } from "../../../graphql/queries/Engine/EntityQuery";
import { EntityForm } from "./EntityForm";

type Props = { pageID: string; entityID: string };

const Wrapper = styled.div`
    margin-top: 5em;
`

type Field = { name: string; value: string }

const EntityEdit: React.FunctionComponent<Props> = props => {
    const { pageID, entityID } = props;

    const [changedFields, setChangedFields] = React.useState<Field[]>([]);

    const onChange = (name: string, value: string) =>
        setChangedFields(R.append({ name, value }, changedFields.filter(e => e.name != name)))

    return (<Wrapper>
        <EntityQueryComponent variables={{ pageID, entityID }} query={ENTITY_QUERY} >
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
                            <EntityForm fields={changedFields} columns={entityQuery.data.entity.row.columns} onChange={onChange} />
                        </>
                    )
                }
                else return (<div>Loading ...</div>)
            }}
        </EntityQueryComponent>
    </Wrapper>)
}

export { EntityEdit };