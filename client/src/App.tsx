import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";
import { any } from "ramda";
import * as React from "react";
import { ApolloProvider } from "react-apollo";
import { HashRouter as Router } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { Routes } from "./components/Routes/Routes";
const httpLink = onError(({ graphQLErrors }) => {
  if (
    graphQLErrors &&
    graphQLErrors.length > 0 &&
    any(e => e.message === "AUTHORISED_ERROR", graphQLErrors)
  ) {
    console.log(graphQLErrors);
  }
}).concat(
  new HttpLink({
    uri: "http://localhost:7930/graphql/"
  })
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "network-only"
    }
  },
  link: httpLink
});

class App extends React.Component {
  public render() {
    return (
      <>
        <ApolloProvider client={client}>
          <Router>
            <Layout>
              <Routes />
            </Layout>
          </Router>
        </ApolloProvider>
      </>
    );
  }
}

export default App;
