import * as React from 'react';
import { Button, Icon, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { USER_APPLICATIONS_QUERY, UserApplicationsQueryComponent } from 'src/graphql/queries/UserApplications/UserApplicationsQuery';

const Applications: React.FunctionComponent = _ => {
    return (<>
        <Link to="/addapplication">
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
                <UserApplicationsQueryComponent query={USER_APPLICATIONS_QUERY}>
                    {
                        response => {
                            if (!response.loading && response.data) {
                                return response.data.userApplications.map((e, i) => {
                                    return (
                                        <Table.Row key={i}>
                                            <Table.Cell>{e.name}</Table.Cell>
                                            <Table.Cell>{e.connection}</Table.Cell>
                                            <Table.Cell><Button>Use</Button></Table.Cell>

                                            {/* <Table.Cell>
                                            <Link to={`/edit-rule/${x.id}`}>
                                                <Icon name="pencil" size="large" color="black" link={true} />
                                            </Link>
                                            <Icon
                                                name="trash"
                                                onClick={() => props.onDelete(x.id)}
                                                size="large"
                                                link={true}
                                            />
                                        </Table.Cell> */}
                                        </Table.Row>
                                    );
                                })
                            }
                            return null;
                        }
                    }
                </UserApplicationsQueryComponent>
            </Table.Body>
        </Table>
    </>)
}

export { Applications };