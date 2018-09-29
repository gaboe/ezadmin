import * as React from "react";
import { Col, Row } from "react-grid-system";
import { RouteComponentProps } from "react-router-dom";
import { DbTableDetail } from "./DbTableDetail/DbTableDetail";

type Props = RouteComponentProps<{ name: string }>;
type State = {};
class Designer extends React.Component<Props, State> {
  public render() {
    const { name } = this.props.match.params;

    return (
      <>
        <Row>
          <Col md={6} lg={3}>
            <DbTableDetail variables={{ tableName: name }} />
          </Col>
        </Row>
      </>
    );
  }
}

export { Designer };
