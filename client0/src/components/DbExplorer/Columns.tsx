import * as React from 'react';
import { Button, Header, List } from 'semantic-ui-react';
import { ColumsByTableQueryComponent, DB_COLUMNS_BY_TABLE_QUERY } from './../../graphql/queries/DbExplorer/ColumnsByTableQuery';
import { DbColumnsByTableNameQueryVariables } from '../../domain/generated/types';
import { Link } from 'react-router-dom';
import { Pointer } from '../Shared/Pointer';
type Props = {
  tableName: string;
  schemaName: string;
};

class Columns extends React.Component<Props> {
  public render() {
    const variables: DbColumnsByTableNameQueryVariables = {
      tableName: this.props.tableName
    };
    return (
      <>
        <ColumsByTableQueryComponent
          query={DB_COLUMNS_BY_TABLE_QUERY}
          variables={variables}
        >
          {response => {
            if (response.loading || !response.data) {
              return null;
            }
            return (
              <>
                <Header content={`Columns of ${this.props.tableName} table`} />
                <Link
                  to={`table/${this.props.schemaName}/${this.props.tableName}`}
                >
                  <Button content="Detail" />
                </Link>
                <List size="large" divided={true} celled={true}>
                  {response.data.columns.map(x => {
                    return (
                      <List.Item key={x.columnName}>
                        <Pointer>
                          {x.columnName}
                        </Pointer>
                      </List.Item>
                    );
                  })}
                </List>
              </>
            );
          }}
        </ColumsByTableQueryComponent>
      </>
    );
  }
}

export { Columns };
