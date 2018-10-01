import * as React from "react";
import { Link } from "react-router-dom";
import { Button, Checkbox, Header, List } from "semantic-ui-react";
import { DbReferenceDirection } from "../../../domain/Designer/DesignerTypes";
import {
  ColumnInput,
  GetDbTableDetailQueryVariables
} from "../../../domain/generated/types";
import {
  DB_TABLE_DETAIL_QUERY,
  DbTablesDetailQueryComponent
} from "../../../graphql/queries/DbExplorer/TableDetail";
import { DbReferences } from "./References/DbReferences";

type Props = {
  variables: GetDbTableDetailQueryVariables;
  isTableNameShown: boolean;
  onCheckboxClick: (column: ColumnInput) => void;
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
                          onClick={() =>
                            this.props.onCheckboxClick({
                              schemaName: x.schemaName,
                              tableName: x.tableName,
                              columnName: x.columnName,
                              isPrimaryKey: x.isPrimaryKey
                            })
                          }
                        />
                        {` [${x.columnName}]: ${x.dataType.toLowerCase()}`}
                      </List.Item>
                    );
                  })}
                </List>
                <DbReferences
                  onCheckboxClick={this.props.onCheckboxClick}
                  direction={DbReferenceDirection.From}
                  title="Referenced columns from this table"
                  references={response.data.table.referencesFromTable}
                />
                <DbReferences
                  onCheckboxClick={this.props.onCheckboxClick}
                  direction={DbReferenceDirection.To}
                  title="Referencing columns to this table"
                  references={response.data.table.referencesToTable}
                />
              </>
            );
          }}
        </DbTablesDetailQueryComponent>
      </>
    );
  }
}

export { DbTableDetail };
