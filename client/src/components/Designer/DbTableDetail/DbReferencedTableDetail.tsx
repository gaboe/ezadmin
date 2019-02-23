import * as React from "react";
import { Checkbox, Header, List } from "semantic-ui-react";
import { DbReferenceDirection } from "../../../domain/Designer/DesignerTypes";
import {
  ColumnInput,
  GetDbTableDetailVariables
} from "../../../domain/generated/types";
import {
  DB_TABLE_DETAIL_QUERY,
  DbTablesDetailQueryComponent
} from "../../../graphql/queries/DbExplorer/TableDetail";
import { DbReferences } from "./References/DbReferences";

type Props = {
  variables: GetDbTableDetailVariables;
  isTableNameShown: boolean;
  onCheckboxClick: (column: ColumnInput, primaryColumn: ColumnInput) => void;
  parentReference: ColumnInput;
};

class DbReferencedTableDetail extends React.Component<Props> {
  public render() {
    return (
      <>
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
            const primaryColumn: ColumnInput = response.data.table.columns
              .filter(e => e.isPrimaryKey)
              .map(x => {
                return {
                  schemaName: x.schemaName,
                  tableName: x.tableName,
                  columnName: x.columnName,
                  isPrimaryKey: x.isPrimaryKey,
                  isHidden: true,
                  keyReference: this.props.parentReference
                };
              })[0];
            return (
              <>
                <Header as="h5">
                  {response.data.table.schemaName}.
                  {response.data.table.tableName}
                </Header>
                <Header as="h5">Columns:</Header>
                <List size="small" divided={true} celled={true}>
                  {response.data.table.columns.map(x => {
                    return (
                      <List.Item key={x.columnName}>
                        <Checkbox
                          onClick={() =>
                            this.props.onCheckboxClick(
                              {
                                schemaName: x.schemaName,
                                tableName: x.tableName,
                                columnName: x.columnName,
                                isPrimaryKey: x.isPrimaryKey,
                                isHidden: false,
                                keyReference: primaryColumn
                              },
                              primaryColumn
                            )
                          }
                        />
                        {` [${x.columnName}]: ${x.dataType.toLowerCase()}`}
                      </List.Item>
                    );
                  })}
                </List>
                <DbReferences
                  onCheckboxClick={e =>
                    this.props.onCheckboxClick(e, primaryColumn)
                  }
                  direction={DbReferenceDirection.From}
                  title="Referenced columns from this table"
                  references={response.data.table.referencesFromTable}
                />
                <DbReferences
                  onCheckboxClick={e =>
                    this.props.onCheckboxClick(e, primaryColumn)
                  }
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

export { DbReferencedTableDetail };
