import * as React from "react";
import { List } from "semantic-ui-react";
import { ColumnInput } from "src/domain/generated/types";
import {
  ColumsByTableQueryComponent,
  DB_COLUMNS_BY_TABLE_QUERY
} from "../../../../graphql/queries/DbExplorer/ColumnsByTableQuery";
import { CheckboxFromReferencedTable } from "./CheckboxFromReferencedTable";

type Props = {
  tableName: string;
  mainTableKeyColumn: string;
  areColumnsShown: boolean;
  onCheckboxClick: (column: ColumnInput) => void;
};

const ReferencedTableColumns: React.SFC<Props> = props => {
  if (!props.areColumnsShown) {
    return null;
  }
  const variables = { tableName: props.tableName };
  return (
    <ColumsByTableQueryComponent
      query={DB_COLUMNS_BY_TABLE_QUERY}
      variables={variables}
    >
      {response => {
        if (!response.loading && response.data && response.data.columns) {
          return response.data.columns.map(x => {
            return (
              <List.Item key={x.columnName}>
                <CheckboxFromReferencedTable
                  column={x}
                  mainTableKeyColumn={props.mainTableKeyColumn}
                  onCheckboxClick={props.onCheckboxClick}
                />
                {` [${x.columnName}]: ${x.dataType.toLowerCase()}`}
              </List.Item>
            );
          });
        }
        return null;
      }}
    </ColumsByTableQueryComponent>
  );
};

export { ReferencedTableColumns };
