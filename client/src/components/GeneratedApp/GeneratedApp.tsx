import * as React from "react";
import { APPID_QUERY, AppIDQueryComponent } from "../../graphql/queries/Auth/AppIDQuery";
import { AppView } from "./AppView";
import { DELETE_ENTITY_MUTATION, DeleteEntityMutationComponent } from "../../graphql/mutations/Engine/DeleteRecord";
import { DeleteEntityMutation, DeleteEntityMutationVariables, GeneratedAppQueryVariables } from "../../domain/generated/types";
import { GENERATED_APP_QUERY, GeneratedAppQueryComponent } from "../../graphql/queries/Engine/AppQuery";
import { MutationFn } from "react-apollo";
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
                <DeleteEntityMutationComponent mutation={DELETE_ENTITY_MUTATION}>
                    {
                        deleteEntity =>
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
                                                        const onDelete = (entityID: string) => {
                                                            if (response.data && response.data.app) {
                                                                const pageID = response.data.app.pages[0].pageID;
                                                                const deleteVariables: DeleteEntityMutationVariables = { appID, pageID, entityID };
                                                                this.delete(deleteEntity, deleteVariables, variables)
                                                            }
                                                        }

                                                        const onEdit = (recordKey: string) => {
                                                            if (response.data && response.data.app) {
                                                                const pageID = response.data.app.pages[0].pageID;
                                                                this.props.history.push(`/app/edit/${pageID}/${recordKey}`)
                                                            }
                                                        }

                                                        return <AppView onEdit={onEdit} onDelete={onDelete} app={response} pageNo={this.state.pageNo} onPageChange={this.changePage} />
                                                    }}
                                                </GeneratedAppQueryComponent>
                                            )
                                        }
                                        return null;
                                    }

                                }
                            </AppIDQueryComponent>
                    }
                </DeleteEntityMutationComponent>
            </>
        );
    }

    private changePage = (pageNo: number) => {
        this.props.history.push(`/app/${this.props.match.params.pageID}/${pageNo}`)

        this.setState({ pageNo })
    }

    private delete = (deleteRecord: MutationFn<DeleteEntityMutation, DeleteEntityMutationVariables>, deleteVariables: DeleteEntityMutationVariables, appQueryVariables: GeneratedAppQueryVariables) => {
        deleteRecord({
            variables: deleteVariables,
            refetchQueries: [{ query: GENERATED_APP_QUERY, variables: appQueryVariables }]
        }).then(deleteResponse => {
            if (deleteResponse && deleteResponse.data) {
                if (deleteResponse.data.deleteEntity.wasDeleted) {
                    toast(<>Record was deleted</>, { type: "success", autoClose: 3000 })
                }
                else {
                    toast(<>{deleteResponse.data.deleteEntity.message}</>, { type: "error", autoClose: 15000 })
                }
            }
        })
    }

};

export { GeneratedApp };
