import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Shared/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    value: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Message',
    placeholder: 'Type your message here',
  },
};

export const WithError: Story = {
  args: {
    label: 'Message',
    error: 'This field is required',
    placeholder: 'Type your message here',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Message',
    placeholder: 'This textarea is disabled',
    disabled: true,
  },
};

export const WithLongContent: Story = {
  args: {
    label: 'Long Message',
    value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
};

export const Required: Story = {
  args: {
    label: 'Required Message',
    placeholder: 'This field is required',
    required: true,
  },
};

export const WithMaxLength: Story = {
  args: {
    label: 'Limited Message',
    placeholder: 'Maximum 50 characters',
    maxLength: 50,
  },
};