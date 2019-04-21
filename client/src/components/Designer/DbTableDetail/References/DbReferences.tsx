import * as React from "react";
import { ColumnInput, DbTableDetailQuery_table_referencesToTable } from "../../../../domain/generated/types";
import { DbReference } from "./Reference/DbReference";
import { DbReferenceDirection } from "../../../../domain/Designer/DesignerTypes";
import { Header, List } from "semantic-ui-react";

type Props = {
  title: string;
  references: DbTableDetailQuery_table_referencesToTable[];
  direction: DbReferenceDirection;
  onCheckboxClick: (column: ColumnInput) => void;
  primaryColumn: ColumnInput;
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
              primaryColumn={this.props.primaryColumn}
            />
          ))}
        </List>
      </>
    );
  }
}

export { DbReferences };
