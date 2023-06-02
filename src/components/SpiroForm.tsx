import { Button, Form } from 'antd'
// min: 26 [0.75, 64]
// medium: 60 [0.5, 48]
// max: 127 [0.5, 16]
// const step = getStepSize(
//   (t) => getHypotrochoidPoint(
//     HYPOTROCHOID_FIXED_RADIUS, movingRadius, pointDistance, t
//   ), [0.75, 64]
// )
function SpiroForm() {
  return (
    <Form>
      <input type="text" placeholder="Name" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <Button htmlType="submit">Submit</Button>
    </Form>
  )
}

export default SpiroForm
