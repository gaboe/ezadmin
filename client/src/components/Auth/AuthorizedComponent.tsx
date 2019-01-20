import * as React from "react";
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps
} from "react-router-dom";

const AuthorizedComponent = (
  o: {
    component:
      | React.ComponentType<RouteComponentProps<any>>
      | React.ComponentType<any>;
  } & RouteProps
) => {
  const { component: Component, ...rest } = o;
  const isAuthenticated = () =>
    localStorage.getItem("AUTHORIZATION_TOKEN") !== null;

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

export { AuthorizedComponent };
