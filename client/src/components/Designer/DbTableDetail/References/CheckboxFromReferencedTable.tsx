import * as React from 'react';
import { Checkbox, Popup } from 'semantic-ui-react';
import { ColumnInput, DbColumnsByTableNameQuery_columns } from '../../../../domain/generated/types';

type Props = {
  column: DbColumnsByTableNameQuery_columns;
  keyReference: ColumnInput;
  onCheckboxClick: (column: ColumnInput) => void;
};

const CheckboxFromReferencedTable: React.FunctionComponent<Props> = props => {
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
