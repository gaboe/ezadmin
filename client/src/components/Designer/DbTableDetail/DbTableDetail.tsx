import * as React from "react";
import styled from "styled-components";
import { any } from "ramda";
import {
  Button,
  Checkbox,
  Header,
  List
  } from "semantic-ui-react";
import { ColumnInput, DbTableDetailQueryVariables } from "../../../domain/generated/types";
import { DB_TABLE_DETAIL_QUERY, DbTablesDetailQueryComponent } from "../../../graphql/queries/DbExplorer/TableDetail";
import { DbReferenceDirection } from "../../../domain/Designer/DesignerTypes";
import { DbReferences } from "./References/DbReferences";
import { Link } from "react-router-dom";
import { NameInput } from "./NameInput";

type Props = {
  variables: DbTableDetailQueryVariables;
  isTableNameShown: boolean;
  onCheckboxClick: (column: ColumnInput) => void;
  onNameChange: (name: string) => void;
  activeColumns: ColumnInput[];
  tableTitle: string;
  onSaveViewClick: () => void;
};

const ActiveColumnsContext = React.createContext<ColumnInput[]>([]);

const TextWrapper = styled.span`
font-size: 2vh;
`

class DbTableDetail extends React.Component<Props> {
  public render() {
    return (
      <>
        <Header as="h1">{this.props.variables.tableName}</Header>

        <DbTablesDetailQueryComponent
          query={DB_TABLE_DETAIL_QUERY}
          variables={this.props.variables}
        >
          {response => {
            if (response.loading || !response.data || !response.data.table) {
              return (
                <>
                  <p>Loading...</p>
                </>
              );
            }
            const primaryColumn: ColumnInput = response.data.table.columns
              .filter(e => e.isPrimaryKey)
              .map(x => {
                return {
                  schemaName: x.schemaName,
                  tableName: x.tableName,
                  columnName: x.columnName,
                  isPrimaryKey: x.isPrimaryKey,
                  isHidden: true
                };
              })[0];
            return (
              <>
                <Header as="h4">
                  Schema: {response.data.table.schemaName}
                </Header>
                <Link
                  to={`/${response.data.table.schemaName}-${
                    response.data.table.tableName
                    }`}
                >
                  <Button content="Back" />
                </Link>
                <br />
                <br />
                <NameInput value={this.props.tableTitle} onChange={this.props.onNameChange} />
                {this.props.activeColumns.length > 0 &&
                  this.props.tableTitle.length > 0 && (
                    <>
                      <br />
                      <br />

                      <Button
                        positive={true}
                        content="Save table"
                        onClick={this.props.onSaveViewClick}
                      />
                    </>)}
                <Header as="h5">Columns:</Header>
                <List size="large" divided={true} celled={true}>
                  {response.data.table.columns.map(x => {
                    return (
                      <List.Item key={x.columnName}>
                        <Checkbox
                          checked={any(
                            e =>
                              e.columnName === x.columnName &&
                              e.tableName === x.tableName &&
                              e.schemaName === x.schemaName,
                            this.props.activeColumns
                          )}
                          onClick={() =>
                            this.props.onCheckboxClick({
                              schemaName: x.schemaName,
                              tableName: x.tableName,
                              columnName: x.columnName,
                              isPrimaryKey: x.isPrimaryKey,
                              isHidden: false,
                              keyReference: primaryColumn
                            })
                          }
                        />
                        <TextWrapper>
                          {` [${x.columnName}]: ${x.dataType.toLowerCase()}`}
                        </TextWrapper>
                      </List.Item>
                    );
                  })}
                </List>
                <ActiveColumnsContext.Provider value={this.props.activeColumns}>
                  <DbReferences
                    onCheckboxClick={e => this.props.onCheckboxClick(e)}
                    direction={DbReferenceDirection.From}
                    title="Referenced columns from this table"
                    references={response.data.table.referencesFromTable}
                    primaryColumn={primaryColumn}
                  />
                  <DbReferences
                    onCheckboxClick={e => this.props.onCheckboxClick(e)}
                    direction={DbReferenceDirection.To}
                    title="Referencing columns to this table"
                    references={response.data.table.referencesToTable}
                    primaryColumn={primaryColumn}
                  />
                </ActiveColumnsContext.Provider>
              </>
            );
          }}
        </DbTablesDetailQueryComponent>
      </>
    );
  }
}

export { DbTableDetail, ActiveColumnsContext };
