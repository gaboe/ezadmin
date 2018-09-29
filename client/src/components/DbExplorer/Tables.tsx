import * as React from "react";
import { Col, Row } from "react-grid-system";
import { Header, List } from "semantic-ui-react";
import { GetDbTablesBySchemaQueryVariables } from "../../domain/generated/types";
import {
  DB_TABLES_BY_SCHEMA_QUERY,
  DbTablesBySchemaQueryComponent
} from "../../graphql/queries/DbExplorer/TableBySchemaQuery";
import { Columns } from "./Columns";

type Props = {
  schemaName: string;
  tableName: string;
  onTableClick: (tableName: string) => void;
};

class Tables extends React.Component<Props> {
  public render() {
    const variables: GetDbTablesBySchemaQueryVariables = {
      schemaName: this.props.schemaName
    };
    return (
      <>
        <Row>
          <Col sm={6}>
            <DbTablesBySchemaQueryComponent
              query={DB_TABLES_BY_SCHEMA_QUERY}
              variables={variables}
            >
              {response => {
                if (response.loading || !response.data) {
                  return null;
                }
                return (
                  <>
                    <Header
                      content={`Tables of ${this.props.schemaName} schema `}
                    />
                    <List
                      size="large"
                      divided={true}
                      animated={true}
                      celled={true}
                    >
                      {response.data.tables.map(x => {
                        return (
                          <List.Item
                            key={x.tableName}
                            onClick={() => this.props.onTableClick(x.tableName)}
                          >
                            {x.tableName}
                          </List.Item>
                        );
                      })}
                    </List>
                  </>
                );
              }}
            </DbTablesBySchemaQueryComponent>
          </Col>
          {this.props.tableName && (
            <>
              <Col sm={6}>
                <Columns tableName={this.props.tableName} />
              </Col>
            </>
          )}
        </Row>
      </>
    );
  }
}

export { Tables };
