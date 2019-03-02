import * as React from 'react';
import styled from 'styled-components';
import { AuthorizedComponent } from '../Auth/AuthorizedComponent';
import { DatabaseExplorer } from './../DbExplorer/DatabaseExplorer';
import { Designer } from '../Designer/Designer';
import { GeneratedApp } from '../Engine/GeneratedApp';
import { Login } from '../Auth/Login/Login';
import { Route } from 'react-router-dom';

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
        <Route exact={true} path="/app/:id?" component={GeneratedApp} />
      </ContenWrapper>
    </>
  );
};

export { Routes };
