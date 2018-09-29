import * as React from "react";
import { DbReferenceDirection } from "../../../../domain/Designer/DesignerTypes";
import { GetDbTableDetailQuery } from "../../../../domain/generated/types";

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
        <p>
          To
          <strong>{` ${props.reference.fromColumn} `}</strong>
          in
          <strong>{` ${props.reference.fromSchema}.${
            props.reference.fromTable
          } `}</strong>
        </p>
      );
    }
    case DbReferenceDirection.To: {
      return (
        <p>
          From
          <strong>{` ${props.reference.toColumn} `}</strong>
          in
          <strong>{` ${props.reference.toSchema}.${
            props.reference.toTable
          } `}</strong>
        </p>
      );
    }
  }
};

export { DbReferenceDescription };
