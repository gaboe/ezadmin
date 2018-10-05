import * as React from "react";
import { Button, List } from "semantic-ui-react";
import { ColumnInput, GetDbTableDetailQuery } from "src/domain/generated/types";
import styled from "styled-components";
import { CheckboxFromReferencedTable } from "./CheckboxFromReferencedTable";

type Props = {
  table: NonNullable<GetDbTableDetailQuery["table"]>;
  mainTableKeyColumn: string;
  onCheckboxClick: (column: ColumnInput) => void;
};

type State = {
  isChecked: boolean;
};

const ButtonWrapper = styled.div`
  margin-top: 1em;
`;

const renderColumns = (props: Props) => {
  return props.table.columns.map(x => {
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
};

class MiniTableDetail extends React.Component<Props, State> {
  public render() {
    this.state = { isChecked: false };
    return (
      <>
        {renderColumns(this.props)}
        <ButtonWrapper>
          <Button
            size="mini"
            content={`${this.state.isChecked ? "Hide" : "Show"} columns`}
            onClick={() => this.setState({ isChecked: !this.state.isChecked })}
          />
        </ButtonWrapper>
      </>
    );
  }
}

export { MiniTableDetail };
