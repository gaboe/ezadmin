import * as React from "react";
import { GeneratedAppQuery, GeneratedAppQueryVariables } from "../../domain/generated/types";
import { Header } from "semantic-ui-react";
import { Layout } from "../Engine/Layout/Layout";
import { QueryResult } from "react-apollo";

type Props = {
    app: QueryResult<GeneratedAppQuery, GeneratedAppQueryVariables>;
    pageNo: number;
    onPageChange: (pageNo: number) => void;
    onDelete: (entityID: string) => void;
    onEdit: (entityID: string) => void;
};

type State = { response?: QueryResult<GeneratedAppQuery, GeneratedAppQueryVariables> };

class AppView extends React.Component<Props, State>{
    public static getDerivedStateFromProps(nexprops: Props, _: State) {
        if (nexprops.app.loading) {
            return null;
        }
        return { response: nexprops.app };
    }

    constructor(props: Props) {
        super(props);
        this.state = {}
    }

    public render() {
        const response = this.state.response;
        if (!response || response.loading || !response.data) {
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
                <Layout onEdit={this.props.onEdit} onDelete={this.props.onDelete} isPreview={false} onPageChange={this.props.onPageChange} app={app} pageNo={this.props.pageNo} />
            </>
        );
    }
}

export { AppView };