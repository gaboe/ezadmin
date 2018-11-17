import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";
import { any } from "ramda";
import * as React from "react";
import { ApolloProvider } from "react-apollo";
import { HashRouter as Router } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { Routes } from "./components/Routes/Routes";

const authLink = setContext((_, o) => {
  // get the authentication token from local storage if it exists
  // const token = localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  const h = {
    headers: {
      ...o.headers,
      authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NDI0ODY2ODEsImF1dGgiOiJtYWRhcmEiLCJhYSI6ImhlaiJ9.6TuwMPgAVFcbNa3BnXWhdZT_4dtC5hXidGEtS98_kVY"
    }
  };
  return h;
});

const httpLink = onError(({ graphQLErrors }) => {
  if (
    graphQLErrors &&
    graphQLErrors.length > 0 &&
    any(e => e.message === "AUTHORIZATION_ERROR", graphQLErrors)
  ) {
    console.log(graphQLErrors);
  }
})
  .concat(authLink)
  .concat(
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
