import * as React from "react";
import * as yup from "yup";
import { Button, Form } from "semantic-ui-react";
import { Col, Row } from "react-grid-system";
import { Formik, FormikProps } from "formik";
import { nameof } from "../../../utils/Utils";
import { RouteComponentProps } from "react-router-dom";
import { SIGN_UP_MUTATION, SignUpMutationComponent } from "../../../graphql/mutations/Auth/SignUpMutation";


type UserRegistration = { email: string; password: string, passwordRepeat: string };
const initialUser: UserRegistration = { email: "", password: "", passwordRepeat: "" };

const RegistrationForm = (props: FormikProps<UserRegistration>) => {
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

                <Form.Field
                    error={props.touched.password && props.errors.password !== undefined}
                >
                    <label>Repeat Password</label>
                    <input
                        value={props.values.passwordRepeat}
                        onChange={props.handleChange}
                        name="passwordRepeat"
                        type="password"
                        placeholder="repeat password"
                    />
                </Form.Field>
                <Button positive={true} onClick={props.submitForm} type="submit">
                    Sign up
                </Button>
            </Form>
        </>
    );
};

const Registration = (props: RouteComponentProps<{}>) => (
    <SignUpMutationComponent mutation={SIGN_UP_MUTATION} fetchPolicy="no-cache">
        {login => (
            <Row>
                <Col offset={{ lg: 4 }} lg={4}>
                    <Formik
                        initialValues={initialUser}
                        onSubmit={values => {
                            login({
                                variables: { email: values.email, password: values.password }
                            }).then(loginResult => {
                                if (
                                    loginResult &&
                                    loginResult.data &&
                                    loginResult.data.signup.token
                                ) {
                                    const token = loginResult.data.signup.token;
                                    localStorage.setItem("AUTHORIZATION_TOKEN", token);
                                    props.history.push("/");
                                }
                            });
                        }}
                        render={RegistrationForm}
                        validationSchema={yup.object<UserRegistration>({
                            password: yup
                                .string()
                                .min(6, "Password is too Short!")
                                .required("Required"),
                            email: yup
                                .string()
                                .email("Invalid email")
                                .required("Required"),
                            passwordRepeat: yup
                                .string()
                                .required("Required")
                                .oneOf([yup.ref(nameof<UserRegistration>("passwordRepeat"))], 'Passwords are not the same!')

                        })}
                    />
                </Col>
            </Row>
        )}
    </SignUpMutationComponent>
);

export { Registration };
