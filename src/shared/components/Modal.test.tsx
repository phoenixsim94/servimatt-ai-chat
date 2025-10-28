import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
  it('does not render when isOpen is false', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal isOpen={false} onClose={onClose}>
        <div>Hidden</div>
      </Modal>
    );

    expect(container.firstChild).toBeNull();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders title and children when open', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Title">
        <div>Modal content</div>
      </Modal>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('calls onClose when clicking the backdrop', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal isOpen={true} onClose={onClose} title="Backdrop Test">
        <div>Content</div>
      </Modal>
    );

    const backdrop = container.querySelector('.absolute');
    expect(backdrop).toBeTruthy();

    if (backdrop) fireEvent.click(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking inside the modal content', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Content Click Test">
        <div data-testid="inside">Inside content</div>
      </Modal>
    );

    const inside = screen.getByTestId('inside');
    fireEvent.click(inside);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed and modal is open', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Escape Test">
        <div>Content</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when Escape is pressed and modal is closed', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={false} onClose={onClose} title="Escape Closed Test">
        <div>Content</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });
});
