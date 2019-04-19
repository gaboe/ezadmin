import * as React from "react";
import { Col, Row } from "react-grid-system";
import { RouteComponentProps } from "react-router-dom";
import { Schemas } from "./Schemas";
import { Tables } from "./Tables";

type State = {
  schemaName: string;
  tableName: string;
};

type Props = RouteComponentProps<{
  schemaName: string;
  tableName: string;
}>;

class DatabaseExplorer extends React.Component<Props, State> {
  public state = {
    schemaName: this.props.match.params.schemaName,
    tableName: this.props.match.params.tableName
  };
  public onSchemaClick = (schemaName: string) => {
    this.setState({ schemaName, tableName: "" });
  };

  public onTableClick = (tableName: string) => {
    this.setState({ tableName });
  };

  public renderTables = () => {
    if (this.state.schemaName) {
      return (
        <>
          <Tables
            schemaName={this.state.schemaName}
            tableName={this.state.tableName}
            onTableClick={this.onTableClick}
          />
        </>
      );
    }
    return null;
  };

  public render() {
    return (
      <>
        <Row>
          <Col sm={3}>
            <Schemas onSchemaClick={this.onSchemaClick} />
          </Col>
          <Col sm={9}>{this.renderTables()}</Col>
        </Row>
      </>
    );
  }
}

export { DatabaseExplorer };
