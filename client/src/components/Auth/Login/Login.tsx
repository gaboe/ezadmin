import * as React from "react";
import * as yup from "yup";
import { Button, Form, Message } from "semantic-ui-react";
import { Col, Row } from "react-grid-system";
import { Formik, FormikProps } from "formik";
import { Link, RouteComponentProps } from "react-router-dom";
import { LOGIN_MUTATION, LoginMutationComponent } from "../../../graphql/mutations/Auth/LoginMutation";

type UserLogin = { email: string; password: string };

type FormStatus = { apiValidationMessage: string };

const initialUser: UserLogin = { email: "", password: "" };

const LoginForm = (props: FormikProps<UserLogin>) => {
  return (
    <>
      <Form>
        <Form.Field
          error={props.touched.email && props.errors.email !== undefined}
        >
          <label>Email</label>
          <input
            value={props.values.email}
            onChange={props.handleChange}
            name="email"
            type="email"
            placeholder="email"
          />
        </Form.Field>
        <Form.Field
          error={props.touched.password && props.errors.password !== undefined}
        >
          <label>Password</label>
          <input
            value={props.values.password}
            onChange={props.handleChange}
            name="password"
            type="password"
            placeholder="password"
          />
        </Form.Field>
        <Button positive={true} onClick={props.submitForm} type="submit">
          Login
        </Button>
        <Link to="signup">
          <Button>
            Sign Up
          </Button>
        </Link>
      </Form>

      {props.status && (props.status as FormStatus).apiValidationMessage
        && <Message
          error={true}
          header={(props.status as FormStatus).apiValidationMessage}
        />
      }
    </>
  );
};

const Login = (props: RouteComponentProps<{}>) => (
  <LoginMutationComponent mutation={LOGIN_MUTATION} fetchPolicy="no-cache">
    {login => (
      <Row>
        <Col offset={{ lg: 4 }} lg={4}>
          <Formik
            initialValues={initialUser}
            onSubmit={(values, { setStatus }) => {
              login({
                variables: { email: values.email, password: values.password }
              }).then(loginResult => {
                if (
                  loginResult &&
                  loginResult.data
                ) {
                  const { token, validationMessage } = loginResult.data.login;
                  if (token) {
                    localStorage.setItem("AUTHORIZATION_TOKEN", token);
                    props.history.push("/");
                  } else if (validationMessage) {
                    const status: FormStatus = {
                      apiValidationMessage: validationMessage

                    }
                    setStatus(status)
                  }
                }
              });
            }}
            render={LoginForm}
            validationSchema={yup.object<UserLogin>({
              password: yup
                .string()
                .min(2, "Too Short!")
                .required("Required"),
              email: yup
                .string()
                .email("Invalid email")
                .required("Required")
            })}
          />
        </Col>
      </Row>
    )}
  </LoginMutationComponent>
);

export { Login };
