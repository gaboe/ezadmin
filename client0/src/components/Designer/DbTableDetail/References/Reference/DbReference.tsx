import * as React from 'react';
import styled from 'styled-components';
import { Button, List } from 'semantic-ui-react';
import { ColumnInput, DbTableDetailQuery_table_referencesToTable } from '../../../../../domain/generated/types';
import { DbReferenceDescription } from './DbReferenceDescription';
import { DbReferenceDirection } from 'src/domain/Designer/DesignerTypes';
import { ReferencedTableColumns } from './ReferencedTableColumns';

type Props = {
  reference: DbTableDetailQuery_table_referencesToTable;
  direction: DbReferenceDirection;
  onCheckboxClick: (column: ColumnInput) => void;
};

type State = {
  isChecked: boolean;
};

const ButtonWrapper = styled.div`
  margin-top: 1em;
`;

const getParentReference = (props: Props) => {
  const { direction, reference } = props;

  const schemaName =
    direction === DbReferenceDirection.From
      ? reference.toSchema
      : reference.fromSchema;

  const tableName =
    direction === DbReferenceDirection.From
      ? reference.toTable
      : reference.fromTable;

  const mainTableKeyColumn =
    direction === DbReferenceDirection.From
      ? reference.toColumn
      : reference.fromColumn;

  const parentReference: ColumnInput = {
    schemaName,
    tableName,
    columnName: mainTableKeyColumn,
    isHidden: true,
    isPrimaryKey: true
  };

  return parentReference;
};

class DbReference extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isChecked: false };
  }
  public render() {
    const { direction, reference } = this.props;
    const schemaName =
      direction === DbReferenceDirection.From
        ? reference.fromSchema
        : reference.toSchema;

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
            schemaName={schemaName}
            tableName={tableName}
            mainTableKeyColumn={mainTableKeyColumn}
            areColumnsShown={this.state.isChecked}
            parentReference={getParentReference(this.props)}
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
