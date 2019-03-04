import * as React from 'react';
import { Col, Row } from 'react-grid-system';
import { Columns } from './Columns';
import { DB_TABLES_BY_SCHEMA_QUERY, DbTablesBySchemaQueryComponent } from '../../graphql/queries/DbExplorer/TableBySchemaQuery';
import { DbTablesBySchemaQueryVariables } from '../../domain/generated/types';
import { Header, List } from 'semantic-ui-react';
import { Pointer } from '../Shared/Pointer';

type Props = {
  schemaName: string;
  tableName: string;
  onTableClick: (tableName: string) => void;
};

class Tables extends React.Component<Props> {
  public render() {
    const variables: DbTablesBySchemaQueryVariables = {
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
                            <Pointer>
                              {x.tableName}
                            </Pointer>
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
                <Columns
                  schemaName={this.props.schemaName}
                  tableName={this.props.tableName}
                />
              </Col>
            </>
          )}
        </Row>
      </>
    );
  }
}

export { Tables };
