import * as React from "react";
import { Header } from "semantic-ui-react";
import { DbReferenceDirection } from "../../../../../domain/Designer/DesignerTypes";
import { GetDbTableDetailQuery } from "../../../../../domain/generated/types";

type Props = {
  reference: NonNullable<
    GetDbTableDetailQuery["table"]
  >["referencesToTable"][0];
  direction: DbReferenceDirection;
};

const DbReferenceDescription: React.SFC<Props> = props => {
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
