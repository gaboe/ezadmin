import * as React from "react";
import { APPID_QUERY, AppIDQueryComponent } from "../../graphql/queries/Auth/AppIDQuery";
import { AppView } from "./AppView";
import { DELETE_RECORD_MUTATION, DeleteRecordMutationComponent } from "../../graphql/mutations/Engine/DeleteRecord";
import { DeleteRecordMutationVariables, GeneratedAppQueryVariables } from "../../domain/generated/types";
import { GENERATED_APP_QUERY, GeneratedAppQueryComponent } from "../../graphql/queries/Engine/AppQuery";
import { RouteComponentProps } from "react-router";
import { toast } from "react-toastify";

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
                <DeleteRecordMutationComponent mutation={DELETE_RECORD_MUTATION}>
                    {
                        deleteRecord =>
                            <AppIDQueryComponent query={APPID_QUERY} fetchPolicy="cache-first">
                                {
                                    appIDResponse => {
                                        if (appIDResponse.data && appIDResponse.data.currentApp) {
                                            const appID = appIDResponse.data.currentApp.appID;
                                            const variables: GeneratedAppQueryVariables = {
                                                id: appID,
                                                pageID,
                                                offset: (this.state.pageNo - 1) * 10,
                                                limit: limit ? Number(limit) : 10
                                            };
                                            return (
                                                <GeneratedAppQueryComponent query={GENERATED_APP_QUERY} variables={variables}>
                                                    {response => {
                                                        const onDelete = (recordKey: string) => {
                                                            if (response.data && response.data.app) {
                                                                const pageID = response.data.app.pages[0].pageID;
                                                                const deleteVariables: DeleteRecordMutationVariables = { appID, pageID, recordKey };

                                                                deleteRecord({
                                                                    variables: deleteVariables,
                                                                    awaitRefetchQueries: true,
                                                                    refetchQueries: [{ query: GENERATED_APP_QUERY, variables: variables }]
                                                                }).then(deleteResponse => {
                                                                    if (deleteResponse && deleteResponse.data) {
                                                                        if (deleteResponse.data.deleteRecord.wasDeleted) {
                                                                            toast(<>Record was deleted</>, { type: "success", autoClose: 3000 })
                                                                        }
                                                                        else {
                                                                            toast(<>{deleteResponse.data.deleteRecord.message}</>, { type: "error", autoClose: 15000 })
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        }

                                                        return <AppView onDelete={onDelete} app={response} pageNo={this.state.pageNo} onPageChange={this.changePage} />
                                                    }}
                                                </GeneratedAppQueryComponent>
                                            )
                                        }
                                        return null;
                                    }

                                }
                            </AppIDQueryComponent>
                    }
                </DeleteRecordMutationComponent>
            </>
        );
    }

    private changePage = (pageNo: number) => {
        this.props.history.push(`/app/${this.props.match.params.pageID}/${pageNo}`)

        this.setState({ pageNo })
    }

};

export { GeneratedApp };
