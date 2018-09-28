import * as React from "react";
import { Link } from "react-router-dom";
import { Button, Header, List } from "semantic-ui-react";
import { GetColumnsByTableNameQueryVariables } from "../../generated-types/types";
import {
  COLUMNS_BY_TABLE_QUERY,
  ColumsByTableQueryComponent
} from "./../../graphql/queries/DbExplorer/ColumnsByTableQuery";
type Props = {
  tableName: string;
};

class Columns extends React.Component<Props> {
  public render() {
    const variables: GetColumnsByTableNameQueryVariables = {
      tableName: this.props.tableName
    };
    return (
      <>
        <ColumsByTableQueryComponent
          query={COLUMNS_BY_TABLE_QUERY}
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
