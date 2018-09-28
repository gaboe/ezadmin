import * as React from "react";
import { Route } from "react-router-dom";
import styled from "styled-components";
import { DatabaseExplorer } from "./../DbExplorer/DatabaseExplorer";

const ContenWrapper = styled.div`
  margin: 2em;
`;

const Routes = () => {
  return (
    <>
      <ContenWrapper>
        <Route exact={true} path="/" component={DatabaseExplorer} />
        {/* <Route
          exact={true}
          path="/:schemaName-:tableName"
          component={DatabaseExplorer}
        /> */}
        {/* <Route path="/table/:name/:cid?" component={TableDetail} /> */}
        {/* <Route exact={true} path="/app/:cid?" component={GeneratedApp} /> */}
      </ContenWrapper>
    </>
  );
};

export { Routes };
