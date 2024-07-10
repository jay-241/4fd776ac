import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ActivityFeed from '../components/ActivityFeed.jsx';  

describe('ActivityFeed Component', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    mockAxios.reset();
  });

  const mockCalls = [
    { id: 1, created_at: '2021-09-01T12:34:56Z', is_archived: false, direction: 'inbound', from: '123456', to: '7890' },
    { id: 2, created_at: '2021-09-02T12:34:56Z', is_archived: true, direction: 'outbound', from: '123456', to: '7890' }
  ];

  it('should display loading indicator initially', () => {
    mockAxios.onGet('https://aircall-backend.onrender.com/activities').reply(200, mockCalls);
    render(<ActivityFeed showAllCalls={true} archiveChange={0} />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it('should load and display calls correctly', async () => {
    mockAxios.onGet('https://aircall-backend.onrender.com/activities').reply(200, mockCalls);
    render(<ActivityFeed showAllCalls={true} archiveChange={0} />);

    await waitFor(() => {
      expect(screen.getByText('123456')).toBeInTheDocument();
      expect(screen.getByText('7890')).toBeInTheDocument();
    });
  });

  it('should display error when API call fails', async () => {
    mockAxios.onGet('https://aircall-backend.onrender.com/activities').reply(500);
    render(<ActivityFeed showAllCalls={true} archiveChange={0} />);

    await waitFor(() => {
      expect(screen.getByText(/error:/i)).toBeInTheDocument();
    });
  });

  it('should allow unarchiving of calls and update UI accordingly', async () => {
    mockAxios.onGet('https://aircall-backend.onrender.com/activities').reply(200, mockCalls);
    mockAxios.onPatch(`https://aircall-backend.onrender.com/activities/1`, { is_archived: false }).reply(200);

    render(<ActivityFeed showAllCalls={true} archiveChange={0} />);
    await waitFor(() => {
      fireEvent.click(screen.getByText(/unarchive/i));
    });

    await waitFor(() => {
      expect(screen.queryByText(/archiving.../i)).not.toBeInTheDocument();
    });
  });
});
