import * as React from 'react';
import * as yup from 'yup';
import { Button, Form } from 'semantic-ui-react';
import { Col, Row } from 'react-grid-system';
import { CREATE_APPLICATION_MUTATION, CreateApplicationMutationComponent } from 'src/graphql/mutations/Applications/AddApplicationMutation';
import { Formik, FormikProps } from 'formik';
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
                        name="name"
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
                        name="connection"
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
    <CreateApplicationMutationComponent mutation={CREATE_APPLICATION_MUTATION}>
        {create => (
            <Row>
                <Col offset={{ lg: 4 }} lg={4}>
                    <Formik
                        initialValues={initialApplication}
                        onSubmit={values => {
                            create({
                                variables: { name: values.name, connection: values.connection }
                            }).then(loginResult => {
                                if (
                                    loginResult &&
                                    loginResult.data &&
                                    loginResult.data.createApplication.message
                                ) {
                                    props.history.push("/apps");
                                }
                            });
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
    </CreateApplicationMutationComponent>
);

export { ApplicationCreate };
