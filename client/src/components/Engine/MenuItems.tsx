import * as React from "react";
import styled from "styled-components";
import { GeneratedAppQuery_app_menuItems as menuItem } from "./../../domain/generated/types";
import { Menu, Sidebar } from "semantic-ui-react";

type Props = {
  menuItems: menuItem[];
  onMenuItemClick: (pageID: string) => void;
};

const Wrapper = styled.div`
  cursor: pointer;
`;

const MenuItems: React.FunctionComponent<Props> = props => {
  const { menuItems, onMenuItemClick } = props;
  return (
    <>
      <Sidebar
        as={Menu}
        width="thin"
        visible={true}
        icon="labeled"
        vertical={true}
        inverted={true}
      >
        {menuItems.length > 0 &&
          menuItems.map(x => {
            return (
              <Menu.Item key={x.name} name="database-explorer" onClick={() => onMenuItemClick(x.pageID)}>
                <Wrapper>
                  {x.name}
                </Wrapper>
              </Menu.Item>
            );
          })}
      </Sidebar>
    </>
  );
};

export { MenuItems };
