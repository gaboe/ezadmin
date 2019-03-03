import * as React from 'react';
import * as yup from 'yup';
import { Button, Form } from 'semantic-ui-react';
import { Col, Row } from 'react-grid-system';
import { Formik, FormikProps } from 'formik';
import { LOGIN_MUTATION, LoginMutationComponent } from 'src/graphql/mutations/Auth/LoginMutation';
import { RouteComponentProps } from 'react-router-dom';


type Application = { name: string; connection: string };
const initialApplication: Application = { name: "", connection: "" };

const FormCreate = (props: FormikProps<Application>) => {
    return (
        <>
            <Form>
                <Form.Field
                    error={props.touched.name && props.errors.name !== undefined}
                >
                    <label>Name</label>
                    <input
                        value={props.values.name}
                        onChange={props.handleChange}
                        name="input"
                        placeholder="name"
                    />
                </Form.Field>
                <Form.Field
                    error={props.touched.connection && props.errors.connection !== undefined}
                >
                    <label>Connection</label>
                    <input
                        value={props.values.connection}
                        onChange={props.handleChange}
                        name="input"
                        placeholder="connection"
                    />
                </Form.Field>
                <Button positive={true} onClick={props.submitForm} type="submit">
                    Save
        </Button>
            </Form>
        </>
    );
};

const ApplicationCreate = (props: RouteComponentProps<{}>) => (
    <LoginMutationComponent mutation={LOGIN_MUTATION}>
        {login => (
            <Row>
                <Col offset={{ lg: 4 }} lg={4}>
                    <Formik
                        initialValues={initialApplication}
                        onSubmit={values => {
                            // login({
                            //     variables: { name: values.name, connection: values.connection }
                            // }).then(loginResult => {
                            //     if (
                            //         loginResult &&
                            //         loginResult.data &&
                            //         loginResult.data.login.token
                            //     ) {
                            //         const token = loginResult.data.login.token;
                            //         localStorage.setItem("AUTHORIZATION_TOKEN", token);
                            //         props.history.push("/");
                            //     }
                            // });
                        }}
                        render={FormCreate}
                        validationSchema={yup.object<Application>({
                            name: yup
                                .string()
                                .required("Required"),
                            connection: yup
                                .string()
                                .required("Required")
                        })}
                    />
                </Col>
            </Row>
        )}
    </LoginMutationComponent>
);

export { ApplicationCreate };
