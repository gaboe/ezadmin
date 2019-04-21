import * as React from "react";
import styled from "styled-components";
import { AppPreviewQuery_appPreview } from "../../../domain/generated/types";
import { MenuItems } from "../MenuItems";
import { Page } from "../Page/Page";
import { Segment, Sidebar } from "semantic-ui-react";

type Props = {
  app: AppPreviewQuery_appPreview;
  pageNo: number;
  isPreview: boolean;
  onPageChange: (pageNo: number) => void;
  onDelete: (entityID: string) => void;
  onEdit: (entityID: string) => void;
};

const Pushable = styled.div`
  min-height: calc(85vh);
`;

const Layout: React.FunctionComponent<Props> = props => {
  const { isPreview, onPageChange, app, pageNo, onDelete, onEdit, children } = props;

  return (
    <>
      <Sidebar.Pushable as={Segment}>
        <Pushable>
          <MenuItems menuItems={app.menuItems} />
          <Sidebar.Pusher>
            <Segment basic={true}>
              <Page onEdit={onEdit}
                isPreview={isPreview}
                onPageChange={onPageChange}
                page={app.pages[0]}
                pageNo={pageNo}
                onDelete={onDelete}>
                {children}
              </Page>
            </Segment>
          </Sidebar.Pusher>
        </Pushable>
      </Sidebar.Pushable>
    </>
  );
}

export { Layout };
