import React, { useReducer, useEffect } from "react";
import { AUTHORIZATION_TOKEN } from "../domain/Constants";

type State = { token: string | null };

type Payload = { token: string | null };

enum ActionType {
	Login,
	Logout
}

type Action = { type: ActionType; payload?: Payload };
type Context = { state: State; dispatch: React.Dispatch<Action> };

const getTokenFromLocalStorage = () => {
	const token = localStorage.getItem(AUTHORIZATION_TOKEN);
	if (token && token.length > 0) {
		return token;
	}
	return null;
};

const initialState: State = {
	token: getTokenFromLocalStorage()
};

const reducer = (state: State, action: Action): State => {
	console.log("reducer", state, action);
	switch (action.type) {
		case ActionType.Login:
			if (action.payload && action.payload.token)
				return { ...state, token: action.payload.token };
			return { ...state };
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
	onResetStore: () => void;
};

const TokenProvider: React.FunctionComponent<Props> = ({
	children,
	onResetStore
}) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	useEffect(() => {
		if (state.token) {
			localStorage.setItem(AUTHORIZATION_TOKEN, state.token);
		} else {
			localStorage.removeItem(AUTHORIZATION_TOKEN);
			onResetStore();
		}
	}, [state.token, onResetStore]);

	return (
		<TokenContext.Provider value={{ state, dispatch }}>
			{children}
		</TokenContext.Provider>
	);
};

export { TokenContext, TokenProvider, ActionType };
