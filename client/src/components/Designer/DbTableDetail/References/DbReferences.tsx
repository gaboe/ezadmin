import * as React from "react";
import { Header, List } from "semantic-ui-react";
import { DbReferenceDirection } from "../../../../domain/Designer/DesignerTypes";
import { GetDbTableDetailQuery } from "../../../../domain/generated/types";
import { DbReference } from "./DbReference";

type Props = {
  title: string;
  references: NonNullable<GetDbTableDetailQuery["table"]>["referencesToTable"];
  direction: DbReferenceDirection;
};

class DbReferences extends React.Component<Props> {
  public render() {
    return (
      <>
        <Header as="h5">{this.props.title}:</Header>
        <List size="large" divided={true} celled={true}>
          {this.props.references.map(x => (
            <DbReference
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
