import * as R from "ramda";
import * as React from "react";
import { Col, Row } from "react-grid-system";
import { RouteComponentProps } from "react-router-dom";
import { ColumnInput } from "src/domain/generated/types";
import { AppPreview } from "../Engine/AppPreview";
import { DbTableDetail } from "./DbTableDetail/DbTableDetail";

type Props = RouteComponentProps<{ name: string; schemaName: string }>;
type State = {
  activeColumns: ColumnInput[];
};
class Designer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { activeColumns: [] };
  }
  public render() {
    const { name, schemaName } = this.props.match.params;

    return (
      <>
        <Row>
          <Col md={6} lg={3}>
            <DbTableDetail
              variables={{ tableName: name }}
              onCheckboxClick={this.toggleColumn}
              isTableNameShown={this.state.activeColumns.length > 0}
            />
          </Col>
          {this.state.activeColumns.length > 0 && (
            <AppPreview
              tableName={name}
              schemaName={schemaName}
              columns={this.state.activeColumns}
            />
          )}
        </Row>
      </>
    );
  }

  public toggleColumn = (column: ColumnInput): void => {
    const isColumnInArray = this.areColumnsEqual(column);

    const activeColumns = R.any(isColumnInArray, this.state.activeColumns)
      ? R.filter(e => !isColumnInArray(e), this.state.activeColumns)
      : R.append(column, this.state.activeColumns);

    this.setState({ activeColumns });
  };

  public areColumnsEqual = (column1: ColumnInput) => (column2: ColumnInput) =>
    column1.columnName === column2.columnName &&
    column1.tableName === column2.tableName &&
    column1.schemaName === column2.schemaName;
}

export { Designer };
