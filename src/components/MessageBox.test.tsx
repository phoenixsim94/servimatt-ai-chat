import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MessageBox } from './MessageBox';

describe('MessageBox', () => {
  const defaultProps = {
    role: 'user' as const,
    content: 'Hello there',
  };

  it('renders user message bubble with correct styling', () => {
    const { container } = render(<MessageBox {...defaultProps} />);
    expect(screen.getByText('Hello there')).toBeInTheDocument();
    const bubble = container.querySelector('div.px-4.py-3.rounded-2xl');
    expect(bubble).toBeTruthy();
    expect(bubble).toHaveClass('bg-gradient-to-br', 'from-[#860100]', 'to-[#5c0000]', 'text-white');
  });

  it('renders assistant message bubble with correct styling', () => {
    const { container } = render(<MessageBox {...defaultProps} role="assistant" />);
    expect(screen.getByText('Hello there')).toBeInTheDocument();
    const bubble = container.querySelector('div.px-4.py-3.rounded-2xl');
    expect(bubble).toBeTruthy();
    expect(bubble).toHaveClass('bg-white', 'text-gray-700', 'border', 'border-gray-200');
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
    const { container } = render(<MessageBox {...defaultProps} content={longContent} />);
    expect(screen.getByText(longContent)).toBeInTheDocument();
    const bubble = container.querySelector('div.px-4.py-3.rounded-2xl');
    expect(bubble).toBeTruthy();
  });

  it('handles messages without timestamp', () => {
    render(<MessageBox {...defaultProps} />);
    const timestampElements = screen.queryAllByText(/^\d{1,2}:\d{2}$/);
    expect(timestampElements).toHaveLength(0);
  });
});