import * as React from "react";
import { Checkbox, Popup } from "semantic-ui-react";
import { GetDbColumnsByTableNameQuery } from "src/domain/generated/types";

type DbColumn = GetDbColumnsByTableNameQuery["columns"][0];

type Props = {
  column: DbColumn;
  keyColumn: string;
  // checkColumn: (column: ColumnInputType) => void;
};

const CheckboxFromReferencedTable: React.SFC<Props> = props => {
  if (props.column.columnName === props.keyColumn) {
    return (
      <Popup
        trigger={<Checkbox disabled={true} readOnly={true} />}
        content="Column is from primary table cannot by referenced"
      />
    );
  }
  return (
    <Checkbox
    // onClick={() =>
    //   props.checkColumn({
    //     columnName: props.column.name,
    //     isFromPrimaryTable: false,
    //     tableName: props.column.tableName,
    //     schemaName: props.column.schemaName,
    //     isKey: props.column.isKey
    //   })
    // }
    />
  );
};

export { CheckboxFromReferencedTable };
