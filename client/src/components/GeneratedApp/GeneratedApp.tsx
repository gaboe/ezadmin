import * as React from "react";
import { APPID_QUERY, AppIDQueryComponent } from "../../graphql/queries/Auth/AppIDQuery";
import { AppView } from "./AppView";
import { DELETE_ENTITY_MUTATION, DeleteEntityMutationComponent } from "../../graphql/mutations/Engine/DeleteRecord";
import { DeleteEntityMutation, DeleteEntityMutationVariables, GeneratedAppQueryVariables } from "../../domain/generated/types";
import { EntityEdit, Field } from "../Engine/Edit/EntityEdit";
import { GENERATED_APP_QUERY, GeneratedAppQueryComponent } from "../../graphql/queries/Engine/AppQuery";
import { MutationFn } from "react-apollo";
import { RouteComponentProps } from "react-router";
import { toast } from "react-toastify";

type Props = RouteComponentProps<{ pageID?: string; offset?: string; limit?: string }>;

type State = { pageNo: number, entityPageID: string | undefined, entityID: string | undefined }

class GeneratedApp extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            pageNo: props.match.params.offset ? Number(props.match.params.offset) / 10 : 1,
            entityPageID: undefined,
            entityID: undefined
        }
    }

    public render() {
        const { pageID, limit } = this.props.match.params;
        const { pageNo, entityPageID, entityID } = this.state;
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
                                                offset: (pageNo - 1) * 10,
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

                                                        const onEdit = (entityID: string) => {
                                                            if (response.data && response.data.app) {
                                                                const pageID = response.data.app.pages[0].pageID;
                                                                this.setState({ entityPageID: pageID, entityID })
                                                            }
                                                        }

                                                        const onMenuItemClick = (pageID: string) => {
                                                            this.setState({ pageNo: 1 },
                                                                () => this.props.history.push(`/app/${pageID}`));
                                                        }

                                                        return (
                                                            <AppView
                                                                app={response}
                                                                pageNo={this.state.pageNo}
                                                                onEdit={onEdit}
                                                                onDelete={onDelete}
                                                                onPageChange={this.changePage}
                                                                onMenuItemClick={onMenuItemClick}>
                                                                {entityPageID && entityID &&
                                                                    <EntityEdit
                                                                        onSubmit={(changedColumns) => this.onEntitySubmit(entityPageID, entityID, changedColumns)}
                                                                        entityID={entityID}
                                                                        pageID={entityPageID}
                                                                    />
                                                                }
                                                            </AppView>
                                                        );
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

    private onEntitySubmit = (entityPageID: string, entityID: string, changedColumns: Field[]) => {
        console.log(entityPageID, entityID, changedColumns)
    }

};

export { GeneratedApp };
