import * as React from "react";
import { AppPreviewQuery } from "src/domain/generated/types";
import { Table } from "../Tables/Table";

type Props = { page: AppPreviewQuery["appPreview"]["pages"][0] };
const Page: React.SFC<Props> = props => {
  return (
    <>
      <Table table={props.page.table} />
    </>
  );
};

export { Page };
