import * as React from 'react';
import { APP_QUERY, AppComponent } from 'src/graphql/queries/Engine/AppQuery';
import { AppVariables } from 'src/domain/generated/types';
import { Layout } from './Layout/Layout';
import { RouteComponentProps } from 'react-router';
type Props = RouteComponentProps<{ id: string; }>;


const GeneratedApp: React.SFC<Props> = props => {

    const variables: AppVariables = {
        id: props.match.params.id
    };
    return (
        <>
            <AppComponent query={APP_QUERY} variables={variables}>
                {response => {
                    if (response.loading || !response.data) {
                        return <>Loading...</>;
                    }
                    return (
                        <>
                            <Layout preview={response.data.app} />
                        </>
                    );
                }}
            </AppComponent>
        </>
    );
};

export { GeneratedApp };
