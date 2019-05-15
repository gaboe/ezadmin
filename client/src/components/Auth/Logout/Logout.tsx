import * as React from "react";
import { Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { TokenContext, ActionType } from "../../../context/TokenContext";

const Logout: React.FunctionComponent = _ => {
	const { dispatch } = React.useContext(TokenContext);

	return (
		<>
			<Link
				to="/login"
				onClick={() => {
					dispatch({ type: ActionType.Logout });
				}}
			>
				<Icon name="sign-out" />
				<>Sign out</>
			</Link>
		</>
	);
};

export { Logout };
