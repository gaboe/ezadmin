import * as R from "ramda";
import * as React from "react";
import { Col, Row } from "react-grid-system";
import { RouteComponentProps } from "react-router-dom";
import { ColumnInput } from "src/domain/generated/types";
import { AppPreview } from "../Engine/AppPreview";
import { DbTableDetail } from "./DbTableDetail/DbTableDetail";

type Props = RouteComponentProps<{ name: string; schema: string }>;
type State = {
  activeColumns: ColumnInput[];
  tableTitle: string;
};

class Designer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { activeColumns: [], tableTitle: "" };
  }
  public render() {
    const { name, schema } = this.props.match.params;

    return (
      <>
        <Row>
          <Col md={6} lg={3}>
            <DbTableDetail
              variables={{ schemaName: schema, tableName: name }}
              onCheckboxClick={this.toggleColumn}
              isTableNameShown={this.state.activeColumns.length > 0}
              onNameChange={e => this.setState({ tableTitle: e })}
              activeColumns={this.state.activeColumns}
            />
          </Col>
          {this.state.activeColumns.length > 0 && (
            <Col md={6} lg={9}>
              <AppPreview
                tableTitle={this.state.tableTitle}
                tableName={name}
                schemaName={schema}
                columns={this.state.activeColumns}
              />
            </Col>
          )}
        </Row>
      </>
    );
  }
  public toggleColumn = (column: ColumnInput): void => {
    const isColumnInArray = this.areColumnsEqual(column);
    const columns = this.state.activeColumns.filter(e => !e.isHidden);

    const activeColumns = R.any(isColumnInArray, columns)
      ? R.filter(e => !isColumnInArray(e), columns)
      : R.append(column, columns);

    console.log(activeColumns);

    this.setState({ activeColumns });
  };

  public areColumnsEqual = (column1: ColumnInput) => (column2: ColumnInput) =>
    column1.columnName === column2.columnName &&
    column1.tableName === column2.tableName &&
    column1.schemaName === column2.schemaName;
}

export { Designer };
