import * as React from 'react';
import styled from 'styled-components';
import { AppPreviewQuery_appPreview } from 'src/domain/generated/types';
import { MenuItems } from '../MenuItems';
import { Page } from '../Page/Page';
import { Segment, Sidebar } from 'semantic-ui-react';

type Props = { preview: AppPreviewQuery_appPreview };
const Pushable = styled.div`
  min-height: calc(85vh);
`;
class Layout extends React.Component<Props> {
  public render() {
    return (
      <>
        <Sidebar.Pushable as={Segment}>
          <Pushable>
            <MenuItems menuItems={this.props.preview.menuItems} />
            <Sidebar.Pusher>
              <Segment basic={true}>
                <Page page={this.props.preview.pages[0]} />
              </Segment>
            </Sidebar.Pusher>
          </Pushable>
        </Sidebar.Pushable>
      </>
    );
  }
}

export { Layout };
