import * as React from "react";
import {
	APPID_QUERY,
	AppIDQueryComponent
} from "../../../graphql/queries/Auth/AppIDQuery";
import { IPrivateRouteProps, RenderComponent } from "./Common";
import { Redirect, Route } from "react-router";

class SelectedApplicationComponent extends Route<IPrivateRouteProps> {
	public render() {
		const { component: Component, ...rest }: IPrivateRouteProps = this.props;
		return (
			<AppIDQueryComponent query={APPID_QUERY}>
				{response => {
					const renderComponent: RenderComponent = props =>
						response.data && response.data.currentApp ? (
							<Component {...props} />
						) : (
							<Redirect to="/app/all" />
						);
					if (response.loading || !response.data) {
						return null;
					}

					return <Route {...rest} render={renderComponent} />;
				}}
			</AppIDQueryComponent>
		);
	}
}

export { SelectedApplicationComponent };
