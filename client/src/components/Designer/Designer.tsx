import * as R from "ramda";
import * as React from "react";
import styled from "styled-components";
import {
	APPID_QUERY,
	AppIDQueryComponent
} from "../../graphql/queries/Auth/AppIDQuery";
import { AppPreview } from "../Engine/AppPreview";
import {
	AppPreviewQueryVariables,
	ColumnInput
} from "../../domain/generated/types";
import { Col, Row } from "react-grid-system";
import { DbTableDetail } from "./DbTableDetail/DbTableDetail";
import { RouteComponentProps } from "react-router-dom";
import {
	SAVE_VIEW_MUTATION,
	SaveViewMutationComponent
} from "../../graphql/mutations/Engine/SaveView";

type Props = RouteComponentProps<{ name: string; schema: string }>;
type State = {
	activeColumns: ColumnInput[];
	tableTitle: string;
};

const ColWrapper = styled(Col)`
	max-height: 860px;
	overflow-y: scroll;
`;

class Designer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { activeColumns: [], tableTitle: props.match.params.name };
	}
	public render() {
		const { name, schema } = this.props.match.params;

		return (
			<>
				<AppIDQueryComponent query={APPID_QUERY}>
					{appIDResponse => {
						if (appIDResponse.data && appIDResponse.data.currentApp) {
							const connection = appIDResponse.data.currentApp.connection;
							return (
								<Row>
									<ColWrapper md={6} lg={3}>
										<SaveViewMutationComponent mutation={SAVE_VIEW_MUTATION}>
											{save => (
												<DbTableDetail
													variables={{ schemaName: schema, tableName: name }}
													onCheckboxClick={this.toggleColumn}
													isTableNameShown={this.state.activeColumns.length > 0}
													onNameChange={e => this.setState({ tableTitle: e })}
													activeColumns={this.state.activeColumns}
													tableTitle={this.state.tableTitle}
													onSaveViewClick={() => {
														const variables: AppPreviewQueryVariables = {
															input: {
																tableTitle: this.state.tableTitle,
																schemaName: schema,
																tableName: name,
																columns: this.state.activeColumns,
																connection
															}
														};
														save({ variables }).then(e => {
															if (e && e.data && e.data.saveView) {
																this.props.history.push(
																	`/app/${e.data.saveView.pageID}`
																);
															}
														});
													}}
												/>
											)}
										</SaveViewMutationComponent>
									</ColWrapper>
									{this.state.activeColumns.length > 0 && (
										<Col md={6} lg={9}>
											<AppPreview
												tableTitle={this.state.tableTitle}
												tableName={name}
												schemaName={schema}
												columns={this.state.activeColumns}
												connection={connection}
											/>
										</Col>
									)}
								</Row>
							);
						}
						return null;
					}}
				</AppIDQueryComponent>
			</>
		);
	}
	public toggleColumn = (column: ColumnInput): void => {
		const isColumnInArray = this.areColumnsEqual(column);
		const columns = this.state.activeColumns.filter(e => !e.isHidden);

		const activeColumns = R.any(isColumnInArray, columns)
			? R.filter(e => !isColumnInArray(e), columns)
			: R.append(column, columns);

		this.setState({ activeColumns });
	};

	public areColumnsEqual = (column1: ColumnInput) => (column2: ColumnInput) =>
		column1.columnName === column2.columnName &&
		column1.tableName === column2.tableName &&
		column1.schemaName === column2.schemaName;
}

export { Designer };
