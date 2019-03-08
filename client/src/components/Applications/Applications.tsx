import * as React from 'react';
import { APPID_QUERY, AppIDQueryComponent } from 'src/graphql/queries/Auth/AppIDQuery';
import { Button, Icon, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { SET_APPID_MUTATION, SetAppIDMutationComponent } from 'src/graphql/mutations/Auth/SetAppIDMutation';
import { USER_APPLICATIONS_QUERY, UserApplicationsQueryComponent } from 'src/graphql/queries/UserApplications/UserApplicationsQuery';

const Applications: React.FunctionComponent = _ => {
    return (<>
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
                    {
                        appIDData =>
                            <SetAppIDMutationComponent mutation={SET_APPID_MUTATION}>
                                {
                                    setAppID =>
                                        <UserApplicationsQueryComponent query={USER_APPLICATIONS_QUERY}>
                                            {
                                                response => {
                                                    if (!response.loading && response.data) {
                                                        return response.data.userApplications.map((e, i) => {
                                                            return (
                                                                <Table.Row key={i}>
                                                                    <Table.Cell>{e.name}</Table.Cell>
                                                                    <Table.Cell>{e.connection}</Table.Cell>
                                                                    <Table.Cell>
                                                                        <Button
                                                                            onClick={() => {
                                                                                setAppID({
                                                                                    variables: { appID: e.appID },
                                                                                    refetchQueries: [{ query: APPID_QUERY }],
                                                                                    awaitRefetchQueries: true
                                                                                }).then(mutationResponse => {
                                                                                    if (mutationResponse && mutationResponse.data && mutationResponse.data.setAppID.token) {
                                                                                        localStorage.setItem("APP_ID", e.appID)
                                                                                        localStorage.setItem("AUTHORIZATION_TOKEN", mutationResponse.data.setAppID.token);
                                                                                        appIDData.refetch()
                                                                                    }
                                                                                })
                                                                            }}>
                                                                            <>
                                                                                Use
                                                                            </>
                                                                        </Button>
                                                                    </Table.Cell>

                                                                </Table.Row>
                                                            );
                                                        })
                                                    }
                                                    return null;
                                                }
                                            }
                                        </UserApplicationsQueryComponent>
                                }
                            </SetAppIDMutationComponent>
                    }
                </AppIDQueryComponent>


            </Table.Body>
        </Table>
    </>)
}

export { Applications };