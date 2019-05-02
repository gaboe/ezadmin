import * as React from "react";
import { any } from "ramda";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { DefaultOptions } from "apollo-client/ApolloClient";
import { HashRouter as Router } from "react-router-dom";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { Layout } from "./components/Layout/Layout";
import { onError } from "apollo-link-error";
import { Routes } from "./components/Routes/Routes";
import { setContext } from "apollo-link-context";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { TokenProvider } from "./context/TokenContext";
import { AUTHORIZATION_TOKEN } from "./domain/Constants";

const authLink = setContext((_, o) => {
	const h = {
		headers: {
			...o.headers,
			authorization: localStorage.getItem(AUTHORIZATION_TOKEN)
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
		localStorage.removeItem(AUTHORIZATION_TOKEN);
	}
})
	.concat(authLink)
	.concat(
		new HttpLink({
			uri: "http://localhost:12355/graphql/"
		})
	);

const defaultOptions: DefaultOptions = {
	watchQuery: {
		fetchPolicy: "cache-and-network",
		errorPolicy: "ignore"
	},
	query: {
		fetchPolicy: "cache-and-network",
		errorPolicy: "all"
	},
	mutate: {
		errorPolicy: "all"
	}
};

const client = new ApolloClient({
	cache: new InMemoryCache(),
	defaultOptions,
	link: httpLink
});

toast.configure();

const App = () => {
	return (
		<>
			<ApolloProvider client={client}>
				<Router>
					<TokenProvider client={client}>
						<Layout>
							<Routes />
						</Layout>
					</TokenProvider>
				</Router>
			</ApolloProvider>
		</>
	);
};

export default App;
