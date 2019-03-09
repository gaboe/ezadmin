import * as React from 'react';
import { APPID_QUERY, AppIDQueryComponent } from 'src/graphql/queries/Auth/AppIDQuery';
import { GENERATED_APP_QUERY, GeneratedAppQueryComponent } from 'src/graphql/queries/Engine/AppQuery';
import { GeneratedAppQueryVariables } from 'src/domain/generated/types';
import { Header } from 'semantic-ui-react';
import { Layout } from './Layout/Layout';
import { RouteComponentProps } from 'react-router';
type Props = RouteComponentProps<{ id: string; }>;


const GeneratedApp: React.FunctionComponent<Props> = props => {

    return (
        <>
            <AppIDQueryComponent query={APPID_QUERY} fetchPolicy="cache-first">
                {
                    appIDResponse => {
                        if (appIDResponse.data && appIDResponse.data.currentApp) {
                            const variables: GeneratedAppQueryVariables = {
                                id: appIDResponse.data.currentApp.appID
                            };
                            return (
                                <GeneratedAppQueryComponent query={GENERATED_APP_QUERY} variables={variables}>
                                    {response => {
                                        if (response.loading || !response.data) {
                                            return <>Loading...</>
                                        }
                                        const app = response.data.app;
                                        if (!app) {
                                            return (<>
                                                <Header content="Your app is empty" />
                                                <div>Use Database Explorer to create app</div>
                                            </>)
                                        }

                                        return (
                                            <>
                                                <Layout preview={app} />
                                            </>
                                        );
                                    }}
                                </GeneratedAppQueryComponent>
                            )
                        }
                        return null;
                    }

                }
            </AppIDQueryComponent>
        </>
    );
};

export { GeneratedApp };
