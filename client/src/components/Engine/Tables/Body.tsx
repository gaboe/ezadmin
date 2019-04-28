import * as React from "react";
import styled from "styled-components";
import { AppPreviewQuery_appPreview_pages_table_rows } from "../../../domain/generated/types";
import { Icon, Table as SemanticTable } from "semantic-ui-react";

type Props = {
    rows: AppPreviewQuery_appPreview_pages_table_rows[];
    isPreview: boolean;
    onEdit: (entityID: string) => void;
    onDelete: (entityID: string) => void;
}

const ActionsWrapper = styled.span`
float: right;
cursor: pointer;
`;

const Body: React.FunctionComponent<Props> = props => {
    const { rows, isPreview, onDelete, onEdit } = props;

    return (<>
        <SemanticTable.Body>
            {rows.length > 0 &&
                rows.map((row, rowIndex) => {
                    return (
                        <SemanticTable.Row key={`${row.key}-${rowIndex}`}>
                            {row.columns.map((c, index) => {
                                return (
                                    <SemanticTable.Cell key={`${row.key}-${rowIndex}-${index}`}>
                                        <span>
                                            {c.value}
                                        </span>
                                        {!isPreview && (row.columns.length - 1) === index &&
                                            <ActionsWrapper>
                                                <Icon name="pencil" onClick={() => onEdit(row.key)} />
                                                <Icon name="trash" onClick={() => onDelete(row.key)} />
                                            </ActionsWrapper>
                                        }
                                    </SemanticTable.Cell>
                                );
                            })}
                        </SemanticTable.Row>
                    );
                })}

        </SemanticTable.Body>
    </>)
}

export { Body };