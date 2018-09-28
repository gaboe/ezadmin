import * as React from "react";
import { Link } from "react-router-dom";
import { Button, Header, List } from "semantic-ui-react";
import { GetDbColumnsByTableNameQueryVariables } from "../../generated-types/types";
import {
  ColumsByTableQueryComponent,
  DB_COLUMNS_BY_TABLE_QUERY
} from "./../../graphql/queries/DbExplorer/ColumnsByTableQuery";
type Props = {
  tableName: string;
};

class Columns extends React.Component<Props> {
  public render() {
    const variables: GetDbColumnsByTableNameQueryVariables = {
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
                <Link to={`table/${this.props.tableName}`}>
                  <Button content="Detail" />
                </Link>
                <List size="large" divided={true} celled={true}>
                  {response.data.columns.map(x => {
                    return (
                      <List.Item key={x.columnName}>{x.columnName}</List.Item>
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
