import React, { useReducer, useEffect } from "react";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { AUTHORIZATION_TOKEN } from "../domain/Constants";

type State = { token: string | null };

type Payload = { token: string | null };

enum ActionType {
	Login,
	Logout
}

type Action = { type: ActionType; payload?: { token: string | null } };
type Context = { state: State; dispatch: React.Dispatch<Action> };

const initialState: State = {
	token: null
};

const reducer = (state: State, action: Action): State => {
	console.log("reducer", state, action);
	switch (action.type) {
		case ActionType.Login:
			if (action.payload && action.payload.token)
				return { ...state, token: action.payload.token };
		case ActionType.Logout:
			return { ...state, token: null };
		default:
			return { ...state };
	}
};

const TokenContext = React.createContext<Context>({
	state: initialState,
	dispatch: {} as React.Dispatch<Action>
});

type Props = {
	client: ApolloClient<NormalizedCacheObject>;
};

const TokenProvider: React.FunctionComponent<Props> = ({
	children,
	client
}) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	useEffect(() => {
		if (state.token) {
			localStorage.setItem(AUTHORIZATION_TOKEN, state.token);
		} else {
			localStorage.setItem(AUTHORIZATION_TOKEN, "");
			client.resetStore();
		}
	}, [state.token]);

	return (
		<TokenContext.Provider value={{ state, dispatch }}>
			{children}
		</TokenContext.Provider>
	);
};

export { TokenContext, TokenProvider, ActionType };
