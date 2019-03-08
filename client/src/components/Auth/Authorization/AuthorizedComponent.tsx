import * as React from 'react';
import { IPrivateRouteProps, RenderComponent } from './Common';
import {
  Redirect,
  Route,
} from 'react-router';

const isAuthenticated = () =>
  localStorage.getItem("AUTHORIZATION_TOKEN") !== null;

class AuthorizedComponent extends Route<IPrivateRouteProps> {
  public render() {
    const { component: Component, ...rest }: IPrivateRouteProps = this.props;
    const renderComponent: RenderComponent = (props) => (
      isAuthenticated()
        ? <Component {...props} />
        : <Redirect to='/login' />
    );

    return (
      <Route {...rest} render={renderComponent} />
    );
  }
}

export { AuthorizedComponent };