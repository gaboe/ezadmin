import * as React from 'react';
import { DbReferenceDirection } from '../../../../../domain/Designer/DesignerTypes';
import { DbTableDetailQuery_table_referencesToTable } from '../../../../../domain/generated/types';
import { Header } from 'semantic-ui-react';

type Props = {
  reference: DbTableDetailQuery_table_referencesToTable;
  direction: DbReferenceDirection;
};

const DbReferenceDescription: React.FunctionComponent<Props> = props => {
  switch (props.direction) {
    case DbReferenceDirection.From: {
      return (
        <Header as="h4">
          {`${props.reference.fromColumn} `}
          in
          {` ${props.reference.fromSchema}.${props.reference.fromTable} `}
        </Header>
      );
    }
    case DbReferenceDirection.To: {
      return (
        <Header as="h4">
          {` ${props.reference.toColumn} `}
          in
          {` ${props.reference.toSchema}.${props.reference.toTable} `}
        </Header>
      );
    }
  }
};

export { DbReferenceDescription };
