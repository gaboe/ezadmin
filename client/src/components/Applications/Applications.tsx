import * as React from 'react';
import { Button, Icon, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

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
                {/* {props.rules.map(x => {
                    return (
                        <Table.Row key={x.id}>
                            <Table.Cell>{x.sender}</Table.Cell>
                            <Table.Cell>{x.subject}</Table.Cell>
                            <Table.Cell>{x.content}</Table.Cell>
                            <Table.Cell>{x.period}</Table.Cell>
                            <Table.Cell>{x.folderName}</Table.Cell>
                            <Table.Cell>
                                <Link to={`/edit-rule/${x.id}`}>
                                    <Icon name="pencil" size="large" color="black" link={true} />
                                </Link>
                                <Icon
                                    name="trash"
                                    onClick={() => props.onDelete(x.id)}
                                    size="large"
                                    link={true}
                                />
                            </Table.Cell>
                        </Table.Row>
                    );
                })} */}
            </Table.Body>
        </Table>
    </>)
}

export { Applications };