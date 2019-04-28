import * as React from "react";
import styled from "styled-components";
import { Button, Form } from "semantic-ui-react";
import { Col, Row } from "react-grid-system";
import { selectFirstOrDefault } from "../../../utils/Utils";
import { ChangedColumn, EntityQuery_entity_columns, } from "../../../domain/generated/types";

type Props = {
    columns: EntityQuery_entity_columns[];
    changedColumns: ChangedColumn[];
    pageID: string;
    entityID: string;
    onChange: (columnID: string, value: string) => void;
    onSubmit: () => void
};

const ButtonsWrapper = styled.div`
    margin-top: 2em;
`;

const EntityForm: React.FunctionComponent<Props> = props => {
    const { columns, changedColumns, onChange, onSubmit } = props;
    return (
        <Row>
            <Col offset={{ lg: 1 }} lg={9}>
                <Form>
                    {columns.map(c => {
                        const column = c.column;
                        const value = selectFirstOrDefault(changedColumns, (x) => x.columnID === c.columnID, (x) => x.value, column.value);
                        return <Form.Field key={c.columnID}>
                            <label>{column.name}</label>
                            <input
                                name="x.name"
                                value={value}
                                onChange={(e) => onChange(c.columnID, e.target.value)}
                            />
                        </Form.Field>
                    }
                    )}
                </Form>
                <ButtonsWrapper>
                    <Button disabled={changedColumns.length === 0} positive={true} onClick={() => onSubmit()} type="submit">
                        Save
                    </Button>
                </ButtonsWrapper>
            </Col>
        </Row>
    );
}

export { EntityForm };