import * as R from "ramda";
import * as React from "react";
import styled from "styled-components";
import { Divider, Header, Icon } from "semantic-ui-react";
import { ENTITY_QUERY, EntityQueryComponent } from "../../../graphql/queries/Engine/EntityQuery";
import { EntityForm } from "./EntityForm";

export type Field = { name: string; value: string }

type Props = {
    pageID: string;
    entityID: string;
    onSubmit: (changedColumns: Field[]) => void
};

const Wrapper = styled.div`
    margin-top: 5em;
`


const EntityEdit: React.FunctionComponent<Props> = props => {
    const { pageID, entityID, onSubmit } = props;

    const [changedColumns, setChangedColumns] = React.useState<Field[]>([]);

    const onChange = (name: string, value: string) =>
        setChangedColumns(R.append({ name, value }, changedColumns.filter(e => e.name != name)))

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
                            <EntityForm onSubmit={() => onSubmit(changedColumns)} fields={changedColumns} columns={entityQuery.data.entity.row.columns} onChange={onChange} />
                        </>
                    )
                }
                else return (<div>Loading ...</div>)
            }}
        </EntityQueryComponent>
    </Wrapper>)
}

export { EntityEdit };