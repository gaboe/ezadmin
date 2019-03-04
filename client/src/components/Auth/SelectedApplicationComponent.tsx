import * as React from 'react';
import { APPID_QUERY, AppIDQueryComponent } from 'src/graphql/queries/Auth/AppIDQuery';
import { Redirect } from 'react-router';
// import {
//     Redirect,
//     Route,
//     RouteComponentProps,
//     RouteProps
//     } from 'react-router-dom';

// const SelectedApplicationComponent = (
//     o: {
//         component:
//         | React.ComponentType<RouteComponentProps<any>>
//         | React.ComponentType<any>;
//     } & RouteProps
// ) => {
//     const { component: Component, ...rest } = o;
//     return (
//         <Route
//             {...rest}
//             render={props =>
//                 <AppIDQueryComponent query={APPID_QUERY}>
//                     {
//                         response => {
//                             if (response.loading || !response.data) {
//                                 return null;
//                             }
//                             if (response.data.appID) {
//                                 return (<Component {...props} />)
//                             }
//                             return (<Redirect
//                                 to={{
//                                     pathname: "/apps",
//                                     state: { from: props.location }
//                                 }}
//                             />)
//                         }
//                     }
//                 </AppIDQueryComponent>
//             }
//         />
//     );
// };

class SelectedApplicationComponent extends React.Component {
    public render() {
        return (
            <AppIDQueryComponent query={APPID_QUERY}>
                {
                    response => {
                        if (response.loading || !response.data) {
                            return null;
                        }
                        if (response.data.appID) {
                            return (this.props.children)
                        }
                        return (<Redirect
                            to={{
                                pathname: "/apps",
                                // state: { from: .location }
                            }}
                        />)
                    }
                }
            </AppIDQueryComponent>
        );
    }
}

export { SelectedApplicationComponent };
