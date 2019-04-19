import * as React from "react";
import { APPID_QUERY, AppIDQueryComponent } from "../../graphql/queries/Auth/AppIDQuery";
import { AppView } from "./AppView";
import { GENERATED_APP_QUERY, GeneratedAppQueryComponent } from "../../graphql/queries/Engine/AppQuery";
import { GeneratedAppQueryVariables } from "../../domain/generated/types";
import { RouteComponentProps } from "react-router";

type Props = RouteComponentProps<{ pageID?: string; offset?: string; limit?: string }>;

type State = { pageNo: number }

class GeneratedApp extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { pageNo: props.match.params.offset ? Number(props.match.params.offset) / 10 : 1 }

    }

    public render() {
        const { pageID, limit } = this.props.match.params;
        return (
            <>
                <AppIDQueryComponent query={APPID_QUERY} fetchPolicy="cache-first">
                    {
                        appIDResponse => {
                            if (appIDResponse.data && appIDResponse.data.currentApp) {
                                const variables: GeneratedAppQueryVariables = {
                                    id: appIDResponse.data.currentApp.appID,
                                    pageID,
                                    offset: (this.state.pageNo - 1) * 10,
                                    limit: limit ? Number(limit) : 10
                                };
                                return (
                                    <GeneratedAppQueryComponent query={GENERATED_APP_QUERY} variables={variables}>
                                        {response => {
                                            return <AppView app={response} pageNo={this.state.pageNo} onPageChange={this.changePage} />
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
    }

    private changePage = (pageNo: number) => {
        this.props.history.push(`/app/${this.props.match.params.pageID}/${pageNo}`)

        this.setState({ pageNo })
    }
};

export { GeneratedApp };
