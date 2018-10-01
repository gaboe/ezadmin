import * as React from "react";
import {
  AppPreviewQueryVariables,
  ColumnInput
} from "src/domain/generated/types";
import {
  APP_PREVIEW_QUERY,
  AppPreviewComponent
} from "src/graphql/queries/Engine/AppPreviewQuery";

type Props = {
  tableName: string;
  schemaName: string;
  columns: ColumnInput[];
};

const AppPreview: React.SFC<Props> = props => {
  const variables: AppPreviewQueryVariables = {
    input: {
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
          return <>Loaded</>;
        }}
      </AppPreviewComponent>
    </>
  );
};

export { AppPreview };
