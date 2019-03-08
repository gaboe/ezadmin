import { RouteComponentProps, RouteProps } from 'react-router';

interface IPrivateRouteProps extends RouteProps {
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>
}
type RenderComponent = (props: RouteComponentProps<any>) => React.ReactNode;

export { IPrivateRouteProps, RenderComponent }