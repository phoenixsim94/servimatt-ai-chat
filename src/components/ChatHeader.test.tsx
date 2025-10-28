import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatHeader } from './ChatHeader';

describe('ChatHeader', () => {
  const defaultProps = {
    title: 'Test Chat',
    showDeleteConfirm: false,
    setShowDeleteConfirm: vi.fn(),
  };

  it('renders title correctly', () => {
    render(<ChatHeader {...defaultProps} />);
    expect(screen.getByText('Test Chat')).toBeInTheDocument();
  });

  it('enters edit mode when edit button is clicked', async () => {
    const onSaveTitle = vi.fn();
    render(<ChatHeader {...defaultProps} onSaveTitle={onSaveTitle} />);
    
    // Find and click edit button (assuming it has an Edit2 icon)
    const editButton = screen.getByRole('button', { name: /edit conversation title/i });
    await userEvent.click(editButton);
    
    // Should show input field
    const input = screen.getByRole('textbox', { name: /edit conversation title/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Test Chat');
  });

  it('saves title when Enter is pressed', async () => {
    const onSaveTitle = vi.fn();
    render(<ChatHeader {...defaultProps} onSaveTitle={onSaveTitle} />);
    
    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /edit conversation title/i });
    await userEvent.click(editButton);
    
    // Type new title and press Enter
    const input = screen.getByRole('textbox', { name: /edit conversation title/i });
    await userEvent.type(input, '{enter}');
    
    expect(onSaveTitle).toHaveBeenCalledWith('Test Chat');
  });

  it('cancels editing when Escape is pressed', async () => {
    const onSaveTitle = vi.fn();
    render(<ChatHeader {...defaultProps} onSaveTitle={onSaveTitle} />);
    
    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /edit conversation title/i });
    await userEvent.click(editButton);
    
    // Type and press Escape
    const input = screen.getByRole('textbox', { name: /edit conversation title/i });
    await userEvent.type(input, 'New Title{escape}');
    
    expect(onSaveTitle).not.toHaveBeenCalled();
    expect(screen.getByText('Test Chat')).toBeInTheDocument();
  });

  it('shows delete confirmation modal when delete button is clicked', async () => {
    const setShowDeleteConfirm = vi.fn();
    render(
      <ChatHeader 
        {...defaultProps} 
        onDelete={vi.fn()}
        setShowDeleteConfirm={setShowDeleteConfirm} 
      />
    );
    
    const deleteButton = screen.getByRole('button', { name: /delete conversation/i });
    await userEvent.click(deleteButton);
    
    expect(setShowDeleteConfirm).toHaveBeenCalledWith(true);
  });

  it('calls onToggleSidebar when menu button is clicked', async () => {
    const onToggleSidebar = vi.fn();
    render(<ChatHeader {...defaultProps} onToggleSidebar={onToggleSidebar} />);
    
    const menuButton = screen.getByRole('button', { name: /open sidebar/i });
    await userEvent.click(menuButton);
    
    expect(onToggleSidebar).toHaveBeenCalled();
  });
});