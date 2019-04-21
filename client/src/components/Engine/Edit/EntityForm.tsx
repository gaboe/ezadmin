import * as React from "react";
import { Col, Row } from "react-grid-system";
import { EntityQuery_entity_row_columns } from "../../../domain/generated/types";
import { Field } from "./EntityEdit";
import { Form } from "semantic-ui-react";
import { selectFirstOrDefault } from "../../../utils/Utils";

type Props = {
    columns: EntityQuery_entity_row_columns[];
    fields: Field[];
    onChange: (columnKey: string, value: string) => void
};

const EntityForm: React.FunctionComponent<Props> = props => {
    const { columns, fields, onChange } = props;
    return (
        <Row>
            <Col offset={{ lg: 1 }} lg={9}>
                <Form>
                    {columns.map(column => {
                        const value = selectFirstOrDefault(fields, (field) => field.name === column.name, (field) => field.value, column.value);
                        return <Form.Field key={column.name}>
                            <label>{column.name}</label>
                            <input
                                name="x.name"
                                value={value}
                                onChange={(e) => onChange(column.name, e.target.value)}
                            />
                        </Form.Field>
                    }

                    )}
                </Form>
            </Col>
        </Row>
    );
}

export { EntityForm };