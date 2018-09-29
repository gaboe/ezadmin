import * as React from "react";
import { Col, Row } from "react-grid-system";
import { Link } from "react-router-dom";
import { Button, Checkbox, Header, List } from "semantic-ui-react";
import { DbReferenceDirection } from "../../../../domain/Designer/DesignerTypes";
import { GetDbTableDetailQueryVariables } from "../../../../domain/generated/types";
import {
  DB_TABLE_DETAIL_QUERY,
  DbTablesDetailQueryComponent
} from "../../../../graphql/queries/DbExplorer/TableDetail";
import { DbReferences } from "./DbReferences";

type Props = {
  variables: GetDbTableDetailQueryVariables;
};

class DbTableDetail extends React.Component<Props> {
  public render() {
    return (
      <>
        <Header as="h1">{this.props.variables.tableName}</Header>

        <DbTablesDetailQueryComponent
          query={DB_TABLE_DETAIL_QUERY}
          variables={this.props.variables}
        >
          {response => {
            if (response.loading || !response.data || !response.data.table) {
              return (
                <>
                  <p>Loading...</p>
                </>
              );
            }

            return (
              <>
                <Row>
                  <Col md={6} lg={3}>
                    <Header as="h4">
                      Schema: {response.data.table.schemaName}
                    </Header>
                    <Link
                      to={`/${response.data.table.schemaName}-${
                        response.data.table.tableName
                      }`}
                    >
                      <Button content="Back" />
                    </Link>

                    <Header as="h5">Columns:</Header>
                    <List size="large" divided={true} celled={true}>
                      {response.data.table.columns.map(x => {
                        return (
                          <List.Item key={x.columnName}>
                            <Checkbox
                            // onClick={() =>
                            //   this.checkColumnFromPrimaryTable(x, true)
                            // }
                            />
                            {` [${x.columnName}]: ${x.dataType.toLowerCase()}`}
                          </List.Item>
                        );
                      })}
                    </List>
                    <DbReferences
                      direction={DbReferenceDirection.From}
                      title="Referenced columns from this table"
                      references={response.data.table.referencesFromTable}
                    />
                    <DbReferences
                      direction={DbReferenceDirection.To}
                      title="Referencing columns to this table"
                      references={response.data.table.referencesToTable}
                    />
                  </Col>
                </Row>
              </>
            );
          }}
        </DbTablesDetailQueryComponent>
      </>
    );
  }
}

export { DbTableDetail };
