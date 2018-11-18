import * as React from "react";

import { Formik, FormikProps } from "formik";
import { Col, Row } from "react-grid-system";
import { Button, Form } from "semantic-ui-react";
import * as Yup from "yup";
type UserLogin = { email: string; password: string };
const initialUser: UserLogin = { email: "", password: "" };

const submitForm = (model: UserLogin) => {
  console.log(model);
};

const LoginForm = (props: FormikProps<UserLogin>) => {
  return (
    <>
      <Form>
        <Form.Field error={props.errors.email !== undefined}>
          <label>Email</label>
          <input
            value={props.values.email}
            onChange={props.handleChange}
            name="email"
            type="email"
            placeholder="email"
          />
        </Form.Field>
        <Form.Field error={props.errors.password !== undefined}>
          <label>Password</label>
          <input
            value={props.values.password}
            onChange={props.handleChange}
            name="password"
            type="password"
            placeholder="password"
          />
        </Form.Field>
        <Button onClick={props.submitForm} type="submit">
          Login
        </Button>
      </Form>
    </>
  );
};

const Login = () => (
  <Row>
    <Col offset={{ lg: 4 }} lg={4}>
      <Formik
        initialValues={initialUser}
        onSubmit={values => {
          submitForm(values);
        }}
        render={LoginForm}
        validationSchema={Yup.object<UserLogin>({
          password: Yup.string()
            .min(2, "Too Short!")
            .required("Required"),
          email: Yup.string()
            .email("Invalid email")
            .required("Required")
        })}
      />
    </Col>
  </Row>
);

export { Login };
