import { Button, Form } from 'antd'

function SpiroForm() {
  return (
    <Form>
      <input type="text" placeholder="Name" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <Button htmlType="submit">Submit</Button>
    </Form>
  );
}

export default SpiroForm;