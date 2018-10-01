import * as R from "ramda";
import * as React from "react";
import { Menu, Sidebar } from "semantic-ui-react";
import { AppPreviewQuery } from "src/domain/generated/types";
import { nameof } from "src/utils/Utils";

type Props = { menuItems: AppPreviewQuery["appPreview"]["menuItems"] };
type MenuItemType = Props["menuItems"][0];

const sortMenuItems = (menuItems: Props["menuItems"]) => {
  const rankName: string = nameof<Props["menuItems"][0]>("rank");
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
