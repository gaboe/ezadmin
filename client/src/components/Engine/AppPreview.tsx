import * as React from "react";
import { APP_PREVIEW_QUERY, AppPreviewQueryComponent } from "../../graphql/queries/Engine/AppPreviewQuery";
import { AppPreviewQueryVariables, ColumnInput } from "../../domain/generated/types";
import { Layout } from "./Layout/Layout";

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
                <Layout onEdit={() => false} onDelete={() => false} isPreview={true} onPageChange={(pageNo) => console.log(pageNo)} app={response.data.appPreview} pageNo={1} />
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
