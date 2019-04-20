import * as React from "react";
import { AppPreviewQuery_appPreview_pages_table_headers } from "../../../domain/generated/types";
import { Table as SemanticTable } from "semantic-ui-react";

type Props = {
    headers: AppPreviewQuery_appPreview_pages_table_headers[];
}

const Header: React.FunctionComponent<Props> = props => {
    const { headers } = props;

    return (
        <SemanticTable.Header>
            <SemanticTable.Row>
                {headers.map(x => (
                    <SemanticTable.HeaderCell key={x.alias}>
                        {x.name}
                    </SemanticTable.HeaderCell>
                ))}
            </SemanticTable.Row>
        </SemanticTable.Header>
    )
}

export { Header };