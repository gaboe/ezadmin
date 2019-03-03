import * as React from 'react';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Logout: React.FunctionComponent = _ => {
    return (<>
        <Link to="/login" onClick={() => {
            localStorage.removeItem("AUTHORIZATION_TOKEN");
        }} >
            <Icon name="sign-out" />
            <>Sign out</>
        </Link>
    </>)
}

export { Logout };