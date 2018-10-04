import * as React from "react";
import { Col, Row as GridRow } from "react-grid-system";
import { Table as T } from "semantic-ui-react";
import { AppPreviewQuery } from "src/domain/generated/types";
import styled from "styled-components";
const Wrapper = styled.div`
  margin-right: -6em;
`;

type Props = { table: AppPreviewQuery["appPreview"]["pages"][0]["table"] };
const Table: React.SFC<Props> = props => {
  const columns =
    props.table.rows.length > 0 ? props.table.rows[0].columns : [];
  return (
    <>
      <Wrapper>
        <GridRow>
          <Col lg={10}>
            <T
              celled={true}
              selectable={true}
              color="blue"
              compact={columns.length > 3 ? true : false}
            >
              <T.Header>
                <T.Row>
                  {columns.map(x => (
                    <T.HeaderCell key={x.name}>{x.name}</T.HeaderCell>
                  ))}
                </T.Row>
              </T.Header>
              <T.Body>
                {props.table.rows.length > 0 &&
                  props.table.rows.map(row => {
                    return (
                      <T.Row key={row.key}>
                        {row.columns.map((c, index) => {
                          return (
                            <T.Cell key={`${row.key}-${index}`}>
                              {c.value}
                            </T.Cell>
                          );
                        })}
                      </T.Row>
                    );
                  })}
              </T.Body>
            </T>
          </Col>
        </GridRow>
      </Wrapper>
    </>
  );
};

export { Table };
