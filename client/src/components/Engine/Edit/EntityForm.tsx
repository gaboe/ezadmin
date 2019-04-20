import * as React from "react";
import { Col, Row } from "react-grid-system";
import { EntityQuery_entity_row_columns } from "../../../domain/generated/types";
import { Form } from "semantic-ui-react";

type Props = { columns: EntityQuery_entity_row_columns[] };

const EntityForm: React.FunctionComponent<Props> = props => {
    return (
        <Row>
            <Col offset={{ lg: 1 }} lg={10}>
                <Form>
                    {props.columns.map(x =>
                        <Form.Field>
                            <label>{x.name}</label>
                            <input
                                value={x.value}
                                name="x.name"
                            />
                        </Form.Field>
                    )}
                </Form>
            </Col>
        </Row>
    );
}

export { EntityForm };