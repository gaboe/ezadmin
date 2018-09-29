import * as React from "react";
import { Button, List } from "semantic-ui-react";
import { DbReferenceDirection } from "src/domain/Designer/DesignerTypes";
import { GetDbTableDetailQuery } from "../../../domain/generated/types";
import { DbReferenceDescription } from "./DbReferenceDescription";

type Props = {
  reference: NonNullable<
    GetDbTableDetailQuery["table"]
  >["referencesToTable"][0];
  direction: DbReferenceDirection;
};

class DbReference extends React.Component<Props> {
  public render() {
    const { direction, reference } = this.props;
    return (
      <>
        <List.Item>
          <DbReferenceDescription reference={reference} direction={direction} />
          {/* <ReferenceColumn
                    checkColumn={this.props.checkColumn}
                    tableName={x.referencedTableName}
                    keyColumn={x.referencingColumnName}
                    displayedTables={this.state.displayedTables}
                  /> */}
          <Button
            size="mini"
            content="Show columns"
            // onClick={() =>
            //   this.toggleTableColumns(
            //     x.referencedSchemaName,
            //     x.referencedTableName,
            //     x.referencedColumnName,
            //     x.referencingColumnName)
            // }
          />
        </List.Item>
      </>
    );
  }
}

export { DbReference };
