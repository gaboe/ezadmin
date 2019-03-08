import * as React from 'react';
import styled from 'styled-components';
import {
  Icon,
  Menu,
  Segment,
  Sidebar
  } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Logout } from '../Auth/Logout/Logout';

const Pushable = styled.div`
  min-height: calc(100vh);
`;

const Children = styled.div`
  margin-top: 4em;
`;

class Layout extends React.Component {
  public render() {
    return (
      <Sidebar.Pushable as={Segment}>
        <Pushable>
          <Sidebar
            as={Menu}
            animation="overlay"
            direction={"top"}
            visible={true}
            inverted={true}
          >
            <Menu.Item name="database-explorer">
              <Link to="/">
                <Icon name="find" />
                Database Explorer
              </Link>
            </Menu.Item>
            <Menu.Item name="app">
              <Link to="/app">
                <Icon name="cloud" />
                Generated App
              </Link>
            </Menu.Item>
            <Menu.Item name="apps">
              <Link to="/app/all">
                <Icon name="list" />
                User applications
              </Link>
            </Menu.Item>
            <Menu.Item position="right" name="app">
              <Logout />
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic={true}>
              <Children>{this.props.children}</Children>
            </Segment>
          </Sidebar.Pusher>
        </Pushable>
      </Sidebar.Pushable>
    );
  }
}

export { Layout };
