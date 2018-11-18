import * as React from "react";
import { Route } from "react-router-dom";
import styled from "styled-components";
import { AuthorizedComponent } from "../Auth/AuthorizedComponent";
import { Login } from "../Auth/Login/Login";
import { Designer } from "../Designer/Designer";
import { DatabaseExplorer } from "./../DbExplorer/DatabaseExplorer";

const ContenWrapper = styled.div`
  margin: 2em;
`;

const Routes = () => {
  return (
    <>
      <ContenWrapper>
        <AuthorizedComponent
          exact={true}
          path="/"
          component={DatabaseExplorer}
        />
        <AuthorizedComponent
          exact={true}
          path="/:schemaName-:tableName"
          component={DatabaseExplorer}
        />
        <Route path="/table/:schema/:name/:cid?" component={Designer} />
        <Route path="/login" component={Login} />
        {/* <Route exact={true} path="/app/:cid?" component={GeneratedApp} /> */}
      </ContenWrapper>
    </>
  );
};

export { Routes };
