import * as React from "react";
import { RouteComponentProps } from "react-router";

type Props = RouteComponentProps<{ pageID: string; entityID: string }>;

const EntityEdit: React.FunctionComponent<Props> = props => {
    const { pageID, entityID } = props.match.params;
    return (<>RecordEdit {pageID} {entityID}</>)
}

export { EntityEdit };