import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import * as React from "react";
import { ApolloProvider } from "react-apollo";
import { HashRouter as Router } from "react-router-dom";
import { Schemas } from "./components/db/Schemas";
// import { Layout } from "./components/layout/Layout";
// import { Routes } from "./components/routes/Routes";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "network-only"
    }
  },
  link: new HttpLink({
    uri: "http://localhost:7930/graphql/"
  })
});

class App extends React.Component {
  public render() {
    return (
      <>
        <ApolloProvider client={client}>
          <Router>
            <Schemas
              onSchemaClick={e => {
                console.log(e);
              }}
            />
            {/* <Layout>
              <Routes />
            </Layout> */}
          </Router>
        </ApolloProvider>
      </>
    );
  }
}

export default App;
