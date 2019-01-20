import * as React from "react";
import { AppPreview_appPreview_pages } from "src/domain/generated/types";
import { Table } from "../Tables/Table";

type Props = { page: AppPreview_appPreview_pages };
const Page: React.SFC<Props> = props => {
  return (
    <>
      <Table table={props.page.table} />
    </>
  );
};

export { Page };
