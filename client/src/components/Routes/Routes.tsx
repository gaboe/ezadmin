import * as React from "react";
import styled from "styled-components";
import { ApplicationCreate } from "../Applications/ApplicationCreate";
import { Applications } from "../Applications/Applications";
import { AuthorizedComponent } from "../Auth/Authorization/AuthorizedComponent";
import { DatabaseExplorer } from "./../DbExplorer/DatabaseExplorer";
import { Designer } from "../Designer/Designer";
import { EntityEdit } from "../Engine/Edit/EntityEdit";
import { GeneratedApp } from "../GeneratedApp/GeneratedApp";
import { Login } from "../Auth/Login/Login";
import { Registration } from "../Auth/Registration/Registration";
import { Route, Switch } from "react-router-dom";
import { SelectedApplicationComponent } from "../Auth/Authorization/SelectedApplicationComponent";

const ContentWrapper = styled.div`
  margin: 2em;
`;

const Routes = () => {
  return (
    <>
      <ContentWrapper>
        <Switch>

          <Route path="/login" component={Login} />
          <Route path="/signup" component={Registration} />

          <AuthorizedComponent exact={true} path="/app/all" component={Applications} />
          <AuthorizedComponent exact={true} path="/app/add" component={ApplicationCreate} />
          <AuthorizedComponent exact={true} path="/app/:pageID?/:offset?/:limit?" component={GeneratedApp} />

          <AuthorizedComponent
            exact={true}
            path="/:schemaName-:tableName"
            component={DatabaseExplorer}
          />
          <AuthorizedComponent path="/table/:schema/:name/:cid?" component={Designer} />

          <SelectedApplicationComponent
            exact={true}
            path="/"
            component={DatabaseExplorer}
          />
        </Switch>

      </ContentWrapper>
    </>
  );
};

export { Routes };
