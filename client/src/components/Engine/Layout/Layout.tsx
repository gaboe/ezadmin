import * as React from "react";
import styled from "styled-components";
import { AppPreviewQuery_appPreview } from "../../../domain/generated/types";
import { MenuItems } from "../MenuItems";
import { Page } from "../Page/Page";
import { Segment, Sidebar } from "semantic-ui-react";

type Props = {
  preview: AppPreviewQuery_appPreview;
  onPageChange: (pageNo: number) => void;
  pageNo: number;
};

const Pushable = styled.div`
  min-height: calc(85vh);
`;

const Layout: React.FunctionComponent<Props> = props => {
  return (
    <>
      <Sidebar.Pushable as={Segment}>
        <Pushable>
          <MenuItems menuItems={props.preview.menuItems} />
          <Sidebar.Pusher>
            <Segment basic={true}>
              <Page onPageChange={props.onPageChange} page={props.preview.pages[0]} pageNo={props.pageNo} />
            </Segment>
          </Sidebar.Pusher>
        </Pushable>
      </Sidebar.Pushable>
    </>
  );
}

export { Layout };
