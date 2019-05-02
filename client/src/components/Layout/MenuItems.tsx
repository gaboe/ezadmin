import * as React from "react";
import { AppIDQuery_currentApp } from "../../domain/generated/types";
import { Icon, Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Logout } from "../Auth/Logout/Logout";
import { TokenContext } from "../../context/TokenContext";

type Props = { app: AppIDQuery_currentApp | null };

const MenuItems: React.FunctionComponent<Props> = props => {
	const { state } = React.useContext(TokenContext);
	const isAuthenticated = state.token;

	return (
		<>
			{props.app && (
				<>
					<Menu.Item name="current-app" active={true} color="blue">
						{props.app.name}
					</Menu.Item>
					<Menu.Item name="database-explorer">
						<Link to="/">
							<Icon name="find" />
							Database Explorer
						</Link>
					</Menu.Item>
					<Menu.Item name="app">
						<Link to="/app">
							<Icon name="cloud" />
							Generated App
						</Link>
					</Menu.Item>
				</>
			)}
			{!isAuthenticated && <Menu.Item name="ezadmin">EzAdmin</Menu.Item>}
			{isAuthenticated && (
				<Menu.Item name="apps">
					<Link to="/app/all">
						<Icon name="list" />
						User applications
					</Link>
				</Menu.Item>
			)}
			{isAuthenticated && (
				<Menu.Item position="right" name="app">
					<Logout />
				</Menu.Item>
			)}
		</>
	);
};

export { MenuItems };
