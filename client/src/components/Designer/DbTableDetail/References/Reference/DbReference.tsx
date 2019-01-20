import * as React from "react";
import { Button, List } from "semantic-ui-react";
import { DbReferenceDirection } from "src/domain/Designer/DesignerTypes";
import styled from "styled-components";
import {
  ColumnInput,
  GetDbTableDetail_table_referencesToTable
} from "../../../../../domain/generated/types";
import { DbReferenceDescription } from "./DbReferenceDescription";
import { ReferencedTableColumns } from "./ReferencedTableColumns";

type Props = {
  reference: GetDbTableDetail_table_referencesToTable;
  direction: DbReferenceDirection;
  onCheckboxClick: (column: ColumnInput) => void;
};

type State = {
  isChecked: boolean;
};

const ButtonWrapper = styled.div`
  margin-top: 1em;
`;

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

    const mainTableKeyColumn =
      direction === DbReferenceDirection.From
        ? reference.fromColumn
        : reference.toColumn;
    return (
      <>
        <List.Item>
          <DbReferenceDescription reference={reference} direction={direction} />
          <ReferencedTableColumns
            onCheckboxClick={this.props.onCheckboxClick}
            tableName={tableName}
            mainTableKeyColumn={mainTableKeyColumn}
            areColumnsShown={this.state.isChecked}
          />
          <ButtonWrapper>
            <Button
              size="mini"
              content={`${this.state.isChecked ? "Hide" : "Show"} columns`}
              onClick={() =>
                this.setState({ isChecked: !this.state.isChecked })
              }
            />
          </ButtonWrapper>
        </List.Item>
      </>
    );
  }
}

export { DbReference };
