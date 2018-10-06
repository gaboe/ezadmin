import * as React from "react";
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
        <div>
          To
          <strong>{` ${props.reference.fromColumn} `}</strong>
          in
          <strong>{` ${props.reference.fromSchema}.${
            props.reference.fromTable
          } `}</strong>
        </div>
      );
    }
    case DbReferenceDirection.To: {
      return (
        <div>
          From
          <strong>{` ${props.reference.toColumn} `}</strong>
          in
          <strong>{` ${props.reference.toSchema}.${
            props.reference.toTable
          } `}</strong>
        </div>
      );
    }
  }
};

export { DbReferenceDescription };
