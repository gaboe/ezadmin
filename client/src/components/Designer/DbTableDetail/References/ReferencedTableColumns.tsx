import * as React from "react";
import { ColumnInput } from "src/domain/generated/types";
import {
  DB_TABLE_DETAIL_QUERY,
  DbTablesDetailQueryComponent
} from "src/graphql/queries/DbExplorer/TableDetail";
import { MiniTableDetail } from "./MiniTableDetail";

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
    <DbTablesDetailQueryComponent
      query={DB_TABLE_DETAIL_QUERY}
      variables={variables}
    >
      {response => {
        if (!response.loading && response.data && response.data.table) {
          return (
            <MiniTableDetail
              table={response.data.table}
              mainTableKeyColumn={props.mainTableKeyColumn}
              onCheckboxClick={props.onCheckboxClick}
            />
          );
        }
        return null;
      }}
    </DbTablesDetailQueryComponent>
  );
};

export { ReferencedTableColumns };
