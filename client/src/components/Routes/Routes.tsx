import * as React from 'react';
import styled from 'styled-components';
import { ApplicationCreate } from '../Applications/ApplicationCreate';
import { Applications } from '../Applications/Applications';
import { AuthorizedComponent } from '../Auth/AuthorizedComponent';
import { DatabaseExplorer } from './../DbExplorer/DatabaseExplorer';
import { Designer } from '../Designer/Designer';
import { GeneratedApp } from '../Engine/GeneratedApp';
import { Login } from '../Auth/Login/Login';
import { Registration } from '../Auth/Registration/Registration';
import { Route } from 'react-router-dom';

const ContenWrapper = styled.div`
  margin: 2em;
`;

const Routes = () => {
  return (
    <>
      <ContenWrapper>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Registration} />

        <Route exact={true} path="/apps" component={Applications} />
        <Route exact={true} path="/addapplication" component={ApplicationCreate} />

        <Route exact={true} path="/app/:id?" component={GeneratedApp} />
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


      </ContenWrapper>
    </>
  );
};

export { Routes };
