import { RouteComponentProps, RouteProps } from "react-router";

export interface IPrivateRouteProps extends RouteProps {
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>
}
export type RenderComponent = (props: RouteComponentProps<any>) => React.ReactNode;