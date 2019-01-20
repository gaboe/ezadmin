import * as React from "react";
import { AppPreviewVariables, ColumnInput } from "src/domain/generated/types";
import {
  APP_PREVIEW_QUERY,
  AppPreviewComponent
} from "src/graphql/queries/Engine/AppPreviewQuery";
import { Layout } from "./Layout/Layout";
type Props = {
  tableTitle: string;
  tableName: string;
  schemaName: string;
  columns: ColumnInput[];
};

const AppPreview: React.SFC<Props> = props => {
  const variables: AppPreviewVariables = {
    input: {
      tableTitle: props.tableTitle,
      schemaName: props.schemaName,
      tableName: props.tableName,
      columns: props.columns
    }
  };
  return (
    <>
      <AppPreviewComponent query={APP_PREVIEW_QUERY} variables={variables}>
        {response => {
          if (response.loading || !response.data) {
            return <>Loading...</>;
          }
          return (
            <>
              <Layout preview={response.data.appPreview} />
            </>
          );
        }}
      </AppPreviewComponent>
    </>
  );
};

export { AppPreview };
