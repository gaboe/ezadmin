import * as React from "react";
import { Col, Row } from "react-grid-system";
import { Link, RouteComponentProps } from "react-router-dom";
import { Button, Checkbox, Header, List } from "semantic-ui-react";
import { GetDbTableDetailQueryVariables } from "../../generated-types/types";
import {
  DB_TABLE_DETAIL_QUERY,
  DbTablesDetailQueryComponent
} from "../../graphql/queries/DbExplorer/TableDetail";
type Props = RouteComponentProps<{ name: string }>;
type State = {};
class Designer extends React.Component<Props, State> {
  public render() {
    const { name } = this.props.match.params;
    const variables: GetDbTableDetailQueryVariables = { tableName: name };

    return (
      <>
        <Header as="h1">{variables.tableName}</Header>
        <DbTablesDetailQueryComponent
          query={DB_TABLE_DETAIL_QUERY}
          variables={variables}
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
                            {` [${x.columnName}]: ${x.columnName}`}
                          </List.Item>
                        );
                      })}
                    </List>
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

export { Designer };
