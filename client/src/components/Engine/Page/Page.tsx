import * as React from 'react';
import { AppPreviewQuery_appPreview_pages } from 'src/domain/generated/types';
import { Header } from 'semantic-ui-react';
import { PagePagination } from './Pagination';
import { Table } from '../Tables/Table';

type Props = {
  page: AppPreviewQuery_appPreview_pages;
  onPageChange: (pageNo: number) => void;
  pageNo: number;
};
const Page: React.FunctionComponent<Props> = props => {
  return (
    <>
      <Header>{props.page.name}</Header>
      <Table table={props.page.table} />
      <PagePagination onPageChange={props.onPageChange} pageNo={props.pageNo} />
    </>
  );
};

export { Page };
