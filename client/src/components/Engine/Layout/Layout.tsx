import * as React from "react";
import { Segment, Sidebar } from "semantic-ui-react";
import { AppPreviewQuery } from "src/domain/generated/types";
import styled from "styled-components";
import { MenuItems } from "../MenuItems";

type Props = { menuItems: AppPreviewQuery["appPreview"]["menuItems"] };
const Pushable = styled.div`
  min-height: calc(85vh);
`;
class Layout extends React.Component<Props> {
  public render() {
    return (
      <>
        <Sidebar.Pushable as={Segment}>
          <Pushable>
            <MenuItems menuItems={this.props.menuItems} />
            <Sidebar.Pusher>
              <Segment basic={true}>{this.props.children}</Segment>
            </Sidebar.Pusher>
          </Pushable>
        </Sidebar.Pushable>
      </>
    );
  }
}

export { Layout };
