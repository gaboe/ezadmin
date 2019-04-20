import * as React from "react";
import styled from "styled-components";
import { AppPreviewQuery_appPreview_pages_table } from "../../../domain/generated/types";
import { Body } from "./Body";
import { Col, Row as GridRow } from "react-grid-system";
import { Header } from "./Header";
import { Table as SemanticTable } from "semantic-ui-react";

const Wrapper = styled.div`
  margin-right: -6em;
`;

type Props = {
  table: AppPreviewQuery_appPreview_pages_table;
  isPreview: boolean;
  onDelete: (key: string) => void;
};

const Table: React.FunctionComponent<Props> = props => {
  const columns =
    props.table.rows.length > 0 ? props.table.rows[0].columns : [];

  const { headers, rows } = props.table

  return (
    <>
      <Wrapper>
        <GridRow>
          <Col lg={10}>
            <SemanticTable
              celled={true}
              selectable={true}
              color="blue"
              compact={columns.length > 3 ? true : false}
            >
              <Header headers={headers} />
              <Body onDelete={props.onDelete} isPreview={props.isPreview} rows={rows} />
            </SemanticTable>
          </Col>
        </GridRow>
      </Wrapper>
    </>
  );
};

export { Table };
