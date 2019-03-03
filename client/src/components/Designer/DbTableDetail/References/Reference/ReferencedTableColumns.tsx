import * as React from 'react';
import styled from 'styled-components';
import { ColumnInput, DbTableDetailQueryVariables } from 'src/domain/generated/types';
import { DbReferencedTableDetail } from '../../DbReferencedTableDetail';

type Props = {
  schemaName: string;
  tableName: string;
  mainTableKeyColumn: string;
  areColumnsShown: boolean;
  onCheckboxClick: (column: ColumnInput) => void;
  parentReference: ColumnInput;
};

const Wrapper = styled.div`
  border: 1px solid #babdc0;
  padding: 5px;
`;

const ReferencedTableColumns: React.SFC<Props> = props => {
  if (!props.areColumnsShown) {
    return null;
  }
  const variables: DbTableDetailQueryVariables = {
    schemaName: props.schemaName,
    tableName: props.tableName
  };
  return (
    <Wrapper>
      <DbReferencedTableDetail
        variables={variables}
        isTableNameShown={true}
        onCheckboxClick={e => props.onCheckboxClick(e)}
        parentReference={props.parentReference}
      />
    </Wrapper>
  );
};

export { ReferencedTableColumns };
