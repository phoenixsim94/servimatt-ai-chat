import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders textarea with default props', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveClass('w-full px-4 py-2 border border-gray-300 rounded-lg');
  });

  it('renders textarea with label', () => {
    render(<Textarea label="Message" />);
    expect(screen.getByText('Message')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders textarea with error message', () => {
    render(<Textarea error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Textarea ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLTextAreaElement));
  });

  it('applies custom className', () => {
    render(<Textarea className="custom-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  it('handles user input correctly', async () => {
    const handleChange = vi.fn();
    render(<Textarea onChange={handleChange} />);
    
    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, 'Hello');
    
    expect(handleChange).toHaveBeenCalledTimes(5); // Once for each character
    expect(textarea).toHaveValue('Hello');
  });

  it('respects disabled state', () => {
    render(<Textarea disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('applies placeholder text', () => {
    render(<Textarea placeholder="Enter message..." />);
    expect(screen.getByPlaceholderText('Enter message...')).toBeInTheDocument();
  });

  it('renders with initial value', () => {
    render(<Textarea value="Initial text" readOnly />);
    expect(screen.getByRole('textbox')).toHaveValue('Initial text');
  });

  it('respects required attribute', () => {
    render(<Textarea required />);
    expect(screen.getByRole('textbox')).toBeRequired();
  });

  it('handles maxLength correctly', () => {
    render(<Textarea maxLength={5} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '5');
  });
});