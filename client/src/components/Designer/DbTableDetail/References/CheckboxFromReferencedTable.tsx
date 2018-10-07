import * as React from "react";
import { Checkbox, Popup } from "semantic-ui-react";
import {
  ColumnInput,
  GetDbColumnsByTableNameQuery
} from "../../../../domain/generated/types";

type DbColumn = GetDbColumnsByTableNameQuery["columns"][0];

type Props = {
  column: DbColumn;
  keyReference: ColumnInput;
  onCheckboxClick: (column: ColumnInput) => void;
};

const CheckboxFromReferencedTable: React.SFC<Props> = props => {
  if (props.column.columnName === props.keyReference.columnName) {
    return (
      <Popup
        trigger={<Checkbox disabled={true} readOnly={true} />}
        content="Column is from primary table and cannot by referenced"
      />
    );
  }
  return (
    <Checkbox
      onClick={() =>
        props.onCheckboxClick({
          columnName: props.column.columnName,
          isPrimaryKey: props.column.isPrimaryKey,
          schemaName: props.column.schemaName,
          tableName: props.column.tableName,
          keyReference: props.keyReference,
          isHidden: false
        })
      }
    />
  );
};

export { CheckboxFromReferencedTable };
