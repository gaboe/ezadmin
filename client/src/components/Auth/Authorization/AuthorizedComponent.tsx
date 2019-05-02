import * as React from "react";
import { IPrivateRouteProps, RenderComponent } from "./Common";
import { Redirect, Route } from "react-router";
import { TokenContext } from "../../../context/TokenContext";

interface Props extends IPrivateRouteProps {}

const AuthorizedComponent: React.FunctionComponent<Props> = props => {
	const { component: Component, ...rest } = props;

	const isAuthenticated = React.useContext(TokenContext).state.token !== null;

	const renderComponent: RenderComponent = props =>
		isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />;

	return <Route {...rest} render={renderComponent} />;
};

export { AuthorizedComponent };
