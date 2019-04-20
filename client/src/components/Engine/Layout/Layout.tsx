import * as React from "react";
import styled from "styled-components";
import { AppPreviewQuery_appPreview } from "../../../domain/generated/types";
import { MenuItems } from "../MenuItems";
import { Page } from "../Page/Page";
import { Segment, Sidebar } from "semantic-ui-react";

type Props = {
  app: AppPreviewQuery_appPreview;
  onPageChange: (pageNo: number) => void;
  pageNo: number;
  isPreview: boolean;
  onDelete: (key: string) => void;
};

const Pushable = styled.div`
  min-height: calc(85vh);
`;

const Layout: React.FunctionComponent<Props> = props => {
  const { isPreview, onPageChange, app, pageNo, onDelete } = props;

  return (
    <>
      <Sidebar.Pushable as={Segment}>
        <Pushable>
          <MenuItems menuItems={app.menuItems} />
          <Sidebar.Pusher>
            <Segment basic={true}>
              <Page isPreview={isPreview} onPageChange={onPageChange} page={app.pages[0]} pageNo={pageNo} onDelete={onDelete} />
            </Segment>
          </Sidebar.Pusher>
        </Pushable>
      </Sidebar.Pushable>
    </>
  );
}

export { Layout };
