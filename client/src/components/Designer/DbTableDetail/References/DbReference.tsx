import * as React from "react";
import { Button, List } from "semantic-ui-react";
import { DbReferenceDirection } from "src/domain/Designer/DesignerTypes";
import { GetDbTableDetailQuery } from "../../../../domain/generated/types";
import { DbReferenceDescription } from "./DbReferenceDescription";
import { ReferencedTableColumns } from "./ReferencedTableColumns";

type Props = {
  reference: NonNullable<
    GetDbTableDetailQuery["table"]
  >["referencesToTable"][0];
  direction: DbReferenceDirection;
};

type State = {
  isChecked: boolean;
};

class DbReference extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isChecked: false };
  }
  public render() {
    const { direction, reference } = this.props;
    const tableName =
      direction === DbReferenceDirection.From
        ? reference.fromTable
        : reference.toTable;

    const key =
      direction === DbReferenceDirection.From
        ? reference.fromColumn
        : reference.toColumn;
    return (
      <>
        <List.Item>
          <DbReferenceDescription reference={reference} direction={direction} />
          <ReferencedTableColumns
            // checkColumn={this.props.checkColumn}
            tableName={tableName}
            keyColumn={key}
            areColumnsShown={this.state.isChecked}
          />
          <Button
            size="mini"
            content={`${this.state.isChecked ? "Hide" : "Show"} columns`}
            onClick={() => this.setState({ isChecked: !this.state.isChecked })}
          />
        </List.Item>
      </>
    );
  }
}

export { DbReference };
