import * as React from "react";
import { GeneratedAppQuery_app_menuItems as menuItem } from "./../../domain/generated/types";
import { Link } from "react-router-dom";
import { Menu, Sidebar } from "semantic-ui-react";

type Props = { menuItems: menuItem[] };

const MenuItems: React.FunctionComponent<Props> = props => {
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
        {props.menuItems.length > 0 &&
          props.menuItems.map(x => {
            return (
              <Menu.Item key={x.name} name="database-explorer">
                <Link to={`/app/${x.pageID}`}>
                  {x.name}
                </Link>
              </Menu.Item>
            );
          })}
      </Sidebar>
    </>
  );
};

export { MenuItems };
