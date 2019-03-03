import * as React from 'react';
import styled from 'styled-components';
import { AppPreviewQuery_appPreview_pages_table } from 'src/domain/generated/types';
import { Col, Row as GridRow } from 'react-grid-system';
import { Table as SemanticTable } from 'semantic-ui-react';
const Wrapper = styled.div`
  margin-right: -6em;
`;

type Props = { table: AppPreviewQuery_appPreview_pages_table };
const Table: React.SFC<Props> = props => {
  const columns =
    props.table.rows.length > 0 ? props.table.rows[0].columns : [];

  const headers = props.table.headers;

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
              <SemanticTable.Header>
                <SemanticTable.Row>
                  {headers.map(x => (
                    <SemanticTable.HeaderCell key={x.alias}>
                      {x.name}
                    </SemanticTable.HeaderCell>
                  ))}
                </SemanticTable.Row>
              </SemanticTable.Header>
              <SemanticTable.Body>
                {props.table.rows.length > 0 &&
                  props.table.rows.map((row, rowIndex) => {
                    return (
                      <SemanticTable.Row key={`${row.key}-${rowIndex}`}>
                        {row.columns.map((c, index) => {
                          return (
                            <SemanticTable.Cell key={`${row.key}-${rowIndex}-${index}`}>
                              {c.value}
                            </SemanticTable.Cell>
                          );
                        })}
                      </SemanticTable.Row>
                    );
                  })}
              </SemanticTable.Body>
            </SemanticTable>
          </Col>
        </GridRow>
      </Wrapper>
    </>
  );
};

export { Table };
