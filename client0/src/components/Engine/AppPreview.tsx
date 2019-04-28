import * as React from 'react';
import { APP_PREVIEW_QUERY, AppPreviewQueryComponent } from 'src/graphql/queries/Engine/AppPreviewQuery';
import { AppPreviewQueryVariables, ColumnInput } from 'src/domain/generated/types';
import { Layout } from './Layout/Layout';
type Props = {
  tableTitle: string;
  tableName: string;
  schemaName: string;
  connection: string;
  columns: ColumnInput[];
};

const AppPreview: React.FunctionComponent<Props> = props => {
  const variables: AppPreviewQueryVariables = {
    input: {
      tableTitle: props.tableTitle,
      schemaName: props.schemaName,
      tableName: props.tableName,
      columns: props.columns,
      connection: props.connection,
    }
  };
  return (
    <>
      <AppPreviewQueryComponent query={APP_PREVIEW_QUERY} variables={variables}>
        {response => {
          if (response.loading || !response.data) {
            return <>Loading...</>;
          }
          if (response.data.appPreview) {
            return (
              <>
                <Layout onPageChange={(pageNo) => console.log(pageNo)} preview={response.data.appPreview} pageNo={1} />
              </>
            );
          }
          return <>App cannot be rendered</>;

        }}
      </AppPreviewQueryComponent>
    </>
  );
};

export { AppPreview };
