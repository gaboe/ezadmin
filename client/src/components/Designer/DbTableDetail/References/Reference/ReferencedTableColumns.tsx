import * as React from "react";
import { ColumnInput } from "src/domain/generated/types";
import styled from "styled-components";
import { DbTableDetail } from "../../DbTableDetail";

type Props = {
  tableName: string;
  mainTableKeyColumn: string;
  areColumnsShown: boolean;
  onCheckboxClick: (column: ColumnInput) => void;
};

const Wrapper = styled.div`
  border: 1px solid #babdc0;
  padding: 5px;
`;

const ReferencedTableColumns: React.SFC<Props> = props => {
  if (!props.areColumnsShown) {
    return null;
  }
  const variables = { tableName: props.tableName };
  return (
    <Wrapper>
      <DbTableDetail
        variables={variables}
        isTableNameShown={true}
        onCheckboxClick={e => props.onCheckboxClick(e)}
      />
    </Wrapper>
  );
};

export { ReferencedTableColumns };
