import * as React from "react";
import { AppPreviewQuery_appPreview_pages } from "../../../domain/generated/types";
import { Header } from "semantic-ui-react";
import { PagePagination } from "./Pagination";
import { Table } from "../Tables/Table";

type Props = {
  page: AppPreviewQuery_appPreview_pages;
  pageNo: number;
  isPreview: boolean;
  onPageChange: (pageNo: number) => void;
  onDelete: (key: string) => void;
  onEdit: (key: string) => void;
};

const Page: React.FunctionComponent<Props> = props => {
  const { pageNo, onPageChange, isPreview, page: { table, name }, onDelete, onEdit } = props;
  return (
    <>
      <Header>{name}</Header>
      <Table onEdit={onEdit} isPreview={isPreview} table={table} onDelete={onDelete} />
      <PagePagination totalPages={Math.ceil(table.allRowsCount / 10)} onPageChange={onPageChange} pageNo={pageNo} />
    </>
  );
};

export { Page };
