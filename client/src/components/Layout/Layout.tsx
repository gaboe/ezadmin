import * as React from "react";
import styled from "styled-components";
import { APPID_QUERY, AppIDQueryComponent } from "../../graphql/queries/Auth/AppIDQuery";
import { Menu, Segment, Sidebar } from "semantic-ui-react";
import { MenuItems } from "./MenuItems";

const Pushable = styled.div`
  min-height: calc(100vh);
`;

const Children = styled.div`
  margin-top: 4em;
`;

const Layout: React.FunctionComponent = props => {
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
          <AppIDQueryComponent query={APPID_QUERY} fetchPolicy="cache-first">
            {response => {
              if (response.data) {
                return (
                  <MenuItems app={response.data.currentApp} />
                );
              }
              return null;
            }}
          </AppIDQueryComponent>
        </Sidebar>
        <Sidebar.Pusher>
          <Segment basic={true}>
            <Children>{props.children}</Children>
          </Segment>
        </Sidebar.Pusher>
      </Pushable>
    </Sidebar.Pushable>
  );
}

export { Layout };
