import { Button, Form } from 'antd'
import { SpirographSettings } from '../utils/maths.type';

interface EditingSpiroProps {
  id: string
  spiro: SpirographSettings
  onEdit: (id: string, newSpiro: SpirographSettings) => void
}

function EditingSpiro(props: EditingSpiroProps) {
  return (
    <div>
      <input type="text" placeholder="Name" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <Button htmlType="submit">Submit</Button>
    </div>
  );
}

export default EditingSpiro;