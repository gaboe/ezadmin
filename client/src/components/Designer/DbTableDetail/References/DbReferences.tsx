import * as React from "react";
import { Header, List } from "semantic-ui-react";
import { DbReferenceDirection } from "../../../../domain/Designer/DesignerTypes";
import {
  ColumnInput,
  GetDbTableDetailQuery
} from "../../../../domain/generated/types";
import { DbReference } from "./DbReference";

type Props = {
  title: string;
  references: NonNullable<GetDbTableDetailQuery["table"]>["referencesToTable"];
  direction: DbReferenceDirection;
  onCheckboxClick: (column: ColumnInput) => void;
};

class DbReferences extends React.Component<Props> {
  public render() {
    return (
      <>
        <Header as="h5">{this.props.title}:</Header>
        <List size="large" divided={true} celled={true}>
          {this.props.references.map(x => (
            <DbReference
              onCheckboxClick={this.props.onCheckboxClick}
              reference={x}
              key={x.referenceName}
              direction={this.props.direction}
            />
          ))}
        </List>
      </>
    );
  }
}

export { DbReferences };
