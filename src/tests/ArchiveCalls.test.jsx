import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ArchiveCalls from '../components/ArchiveCalls.jsx';  

describe('ArchiveCalls Component', () => {
  const mockAxios = new MockAdapter(axios);
  const triggerArchiveChange = jest.fn();

  beforeEach(() => {
    mockAxios.reset();
  });

  it('should display "Archive all calls" when not archiving', () => {
    render(<ArchiveCalls triggerArchiveChange={triggerArchiveChange} />);
    expect(screen.getByText(/archive all calls/i)).toBeInTheDocument();
  });

  it('should display "Archiving..." and call triggerArchiveChange when archiving is successful', async () => {
    mockAxios.onGet('https://aircall-backend.onrender.com/activities').reply(200, [
      { id: 1, is_archived: false }
    ]);
    mockAxios.onPatch(`https://aircall-backend.onrender.com/activities/1`, { is_archived: true }).reply(200);

    render(<ArchiveCalls triggerArchiveChange={triggerArchiveChange} />);
    fireEvent.click(screen.getByText(/archive all calls/i));

    expect(screen.getByText(/archiving.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(triggerArchiveChange).toHaveBeenCalledTimes(1);
    });
  });

 
});
