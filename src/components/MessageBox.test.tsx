import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MessageBox } from './MessageBox';

describe('MessageBox', () => {
  const defaultProps = {
    role: 'user' as const,
    content: 'Hello there',
  };

  it('renders user message correctly', () => {
    render(<MessageBox {...defaultProps} />);

    expect(screen.getByText('Hello there')).toBeInTheDocument();
    const container = screen.getByText('Hello there').closest('div');
    expect(container).toHaveClass('bg-gradient-to-br', 'from-[#860100]', 'to-[#5c0000]', 'text-white');
  });

  it('renders assistant message correctly', () => {
    render(<MessageBox {...defaultProps} role="assistant" />);

    expect(screen.getByText('Hello there')).toBeInTheDocument();
    const container = screen.getByText('Hello there').closest('div');
    expect(container).toHaveClass('bg-white', 'text-gray-700', 'border', 'border-gray-200');
  });

  it('displays user icon for user messages', () => {
    const { container } = render(<MessageBox {...defaultProps} />);
    const userIcon = container.querySelector('.lucide-user');
    if (!userIcon) throw new Error('User Icon is missing');
    expect(userIcon).toBeInTheDocument();
    expect(userIcon.closest('div')).toHaveClass('bg-gradient-to-br', 'from-[#860100]', 'to-[#5c0000]');
  });

  it('displays bot icon for assistant messages', () => {
    const { container } = render(<MessageBox {...defaultProps} />);
    const botIcon = container.querySelector('.lucide-bot');
    if (botIcon) {
      expect(botIcon).toBeInTheDocument();
      expect(botIcon.closest('div')).toHaveClass('bg-gray-100');
    };
  });

  it('formats timestamp correctly', () => {
    const timestamp = '2025-10-28T14:30:00Z';
    render(<MessageBox {...defaultProps} timestamp={timestamp} />);

    // Format should match: HH:mm (24-hour format)
    const time = new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    expect(screen.getByText(time)).toBeInTheDocument();
  });

  it('handles long messages without breaking layout', () => {
    const longContent = 'a'.repeat(500);
    render(<MessageBox {...defaultProps} content={longContent} />);

    const messageText = screen.getByText(longContent);
    expect(messageText).toHaveClass('break-words');
  });

  it('handles messages without timestamp', () => {
    render(<MessageBox {...defaultProps} />);
    const timestampElements = screen.queryAllByText(/^\d{1,2}:\d{2}$/);
    expect(timestampElements).toHaveLength(0);
  });
});