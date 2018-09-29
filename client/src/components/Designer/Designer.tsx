import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { DbTableDetail } from "./DbTableDetail/DbTableDetail";

type Props = RouteComponentProps<{ name: string }>;
type State = {};
class Designer extends React.Component<Props, State> {
  public render() {
    const { name } = this.props.match.params;

    return (
      <>
        <DbTableDetail variables={{ tableName: name }} />
      </>
    );
  }
}

export { Designer };
