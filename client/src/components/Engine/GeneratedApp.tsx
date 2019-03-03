import * as React from 'react';
import { GENERATED_APP_QUERY, GeneratedAppQueryComponent } from 'src/graphql/queries/Engine/AppQuery';
import { GeneratedAppQueryVariables } from 'src/domain/generated/types';
import { Layout } from './Layout/Layout';
import { RouteComponentProps } from 'react-router';
type Props = RouteComponentProps<{ id: string; }>;


const GeneratedApp: React.SFC<Props> = props => {

    const variables: GeneratedAppQueryVariables = {
        id: props.match.params.id
    };
    return (
        <>
            <GeneratedAppQueryComponent query={GENERATED_APP_QUERY} variables={variables}>
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
            </GeneratedAppQueryComponent>
        </>
    );
};

export { GeneratedApp };
