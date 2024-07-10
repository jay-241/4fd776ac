import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import NavBar from '../components/NavBar.jsx';  

describe('NavBar Component', () => {
  it('calls onTabChange with true when "All Calls" tab is clicked', () => {
    const mockOnTabChange = jest.fn();
    render(<NavBar onTabChange={mockOnTabChange} />);

    const allCallsTab = screen.getByRole('button', { name: /all calls/i });
    fireEvent.click(allCallsTab);

    expect(mockOnTabChange).toHaveBeenCalledWith(true);
  });

  it('calls onTabChange with false when "Inbox" tab is clicked', () => {
    const mockOnTabChange = jest.fn();
    render(<NavBar onTabChange={mockOnTabChange} />);

    const inboxTab = screen.getByRole('button', { name: /inbox/i });
    fireEvent.click(inboxTab);

    expect(mockOnTabChange).toHaveBeenCalledWith(false);
  });
});
