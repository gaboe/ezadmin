import * as R from "ramda";
import * as React from "react";
import { Menu, Sidebar } from "semantic-ui-react";
import { AppPreview_appPreview_menuItems as menuItem } from "src/domain/generated/types";
import { nameof } from "src/utils/Utils";

type Props = { menuItems: menuItem[] };
type MenuItemType = menuItem;

const sortMenuItems = (menuItems: menuItem[]) => {
  const rankName: string = nameof<menuItem>("rank");
  const rankSort = R.sortWith<MenuItemType>([R.ascend(R.prop(rankName))]);
  return rankSort(menuItems);
};

const MenuItems: React.SFC<Props> = props => {
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
          sortMenuItems(props.menuItems).map(x => {
            return (
              <Menu.Item key={x.name} name="database-explorer">
                {/* <Link to={`${this.props.urlPath}/${x.pageCid}`}> */}
                {x.name}
                {/* </Link> */}
              </Menu.Item>
            );
          })}
      </Sidebar>
    </>
  );
};

export { MenuItems };
