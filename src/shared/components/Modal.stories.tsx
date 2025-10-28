import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { Modal } from './Modal';
import { Button } from './Button';

const meta: Meta<typeof Modal> = {
  title: 'Shared/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    title: { control: 'text' },
    onClose: { action: 'onClose' },
    children: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Open: Story = {
  args: {
    isOpen: true,
    title: 'Example Modal',
    onClose: action('onClose'),
    children: (
      <div>
        <p className="text-sm text-gray-700">This is an example modal. Click outside or press Escape to close.</p>
      </div>
    ),
  },
};

export const WithLongContent: Story = {
  args: {
    isOpen: true,
    title: 'Long Content Modal',
    onClose: action('onClose'),
    children: (
      <div>
        <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.</p>
        <p className="mb-4">Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.</p>
        <p className="mb-4">Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.</p>
      </div>
    ),
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    title: 'Closed Modal',
    onClose: action('onClose'),
    children: <div>The modal is closed and should render nothing.</div>,
  },
};

interface InteractiveTemplateArgs {
  isOpen?: boolean;
}

const InteractiveTemplate = (args: InteractiveTemplateArgs) => {
  const [open, setOpen] = useState<boolean>(!!args.isOpen);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal
        children={undefined} {...args}
        isOpen={open}
        onClose={() => {
          action('onClose')();
          setOpen(false);
        }} />
    </div>
  );
};

export const Interactive: Story = {
  render: (args) => <InteractiveTemplate {...args} />,
  args: {
    isOpen: false,
    title: 'Interactive Modal',
    children: (
      <p>
        Click the button to open this modal, then click outside or press Escape
        to close.
      </p>
    ),
  },
};

// export const Interactive: Story = {
//   render: (args) => {
//     const [open, setOpen] = useState<boolean>(!!args.isOpen);

//     return (
//       <div>
//         <Button
//           onClick={() => setOpen(true)}
//         >
//           Open Modal
//         </Button>

//         <Modal
//           {...args}
//           isOpen={open}
//           onClose={() => {
//             action('onClose')();
//             setOpen(false);
//           }}
//         />
//       </div>
//     );
//   },
//   args: {
//     isOpen: false,
//     title: 'Interactive Modal',
//     children: <p>Click the button to open this modal, then click outside or press Escape to close.</p>,
//   },
// };
