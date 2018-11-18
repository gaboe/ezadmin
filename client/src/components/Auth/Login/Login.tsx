import * as React from "react";

import { Col, Row } from "react-grid-system";
import { Button, Form } from "semantic-ui-react";

const Login = () => (
  <Row>
    <Col offset={{ lg: 3 }} lg={6}>
      <Form>
        <Form.Field>
          <label>Email</label>
          <input type="email" placeholder="email" />
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <input type="password" placeholder="password" />
        </Form.Field>
        <Button type="submit">Login</Button>
      </Form>
    </Col>
  </Row>
);

export { Login };
