import * as React from "react";
import {
	APPID_QUERY,
	AppIDQueryComponent
} from "../../graphql/queries/Auth/AppIDQuery";
import { Button, Icon, Table, Header } from "semantic-ui-react";
import { Link, RouteComponentProps } from "react-router-dom";
import {
	SET_APPID_MUTATION,
	SetAppIDMutationComponent
} from "../../graphql/mutations/Auth/SetAppIDMutation";
import {
	USER_APPLICATIONS_QUERY,
	UserApplicationsQueryComponent
} from "../../graphql/queries/UserApplications/UserApplicationsQuery";
import { TokenContext, ActionType } from "../../context/TokenContext";

const Applications: React.FunctionComponent<RouteComponentProps> = props => {
	const { dispatch } = React.useContext(TokenContext);

	return (
		<>
			<Header>Applications</Header>

			<Link to="/app/add">
				<Button icon={true} labelPosition="right">
					Add application
					<Icon name="plus" color="black" link={true} />
				</Button>
			</Link>
			<Table>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>Name</Table.HeaderCell>
						<Table.HeaderCell>Connection</Table.HeaderCell>
						<Table.HeaderCell />
					</Table.Row>
				</Table.Header>

				<Table.Body>
					<AppIDQueryComponent query={APPID_QUERY}>
						{appIDData => (
							<SetAppIDMutationComponent mutation={SET_APPID_MUTATION}>
								{setAppID => (
									<UserApplicationsQueryComponent
										query={USER_APPLICATIONS_QUERY}
									>
										{response => {
											if (
												!response.loading &&
												response.data &&
												response.data.userApplications &&
												appIDData.data
											) {
												const data = appIDData.data;
												return response.data.userApplications.map((e, i) => {
													const isUsed =
														(data.currentApp &&
															data.currentApp.appID === e.appID) === true;
													return (
														<Table.Row key={i}>
															<Table.Cell>{e.name}</Table.Cell>
															<Table.Cell>{e.connection}</Table.Cell>
															<Table.Cell>
																<Button
																	positive={isUsed}
																	onClick={() => {
																		setAppID({
																			variables: { appID: e.appID }
																		}).then(mutationResponse => {
																			if (
																				mutationResponse &&
																				mutationResponse.data &&
																				mutationResponse.data.setAppID.token
																			) {
																				localStorage.setItem("APP_ID", e.appID);
																				dispatch({
																					type: ActionType.Login,
																					payload: {
																						token:
																							mutationResponse.data.setAppID
																								.token
																					}
																				});

																				appIDData.refetch().then(__ => {
																					props.history.push("/");
																				});
																			}
																		});
																	}}
																>
																	<>{isUsed ? "Using" : "Use"}</>
																</Button>
															</Table.Cell>
														</Table.Row>
													);
												});
											}
											return null;
										}}
									</UserApplicationsQueryComponent>
								)}
							</SetAppIDMutationComponent>
						)}
					</AppIDQueryComponent>
				</Table.Body>
			</Table>
		</>
	);
};

export { Applications };
