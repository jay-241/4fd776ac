import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdCallMissed, MdCallReceived, MdCallMade, MdUnarchive } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import './ActivityFeed.css';

// Component to display call activities, filterable and with unarchive functionality.
const ActivityFeed = ({ showAllCalls, archiveChange }) => {
    const [calls, setCalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetches and groups calls by date whenever the filters or the archive state changes.
    useEffect(() => {
        const fetchCalls = async () => {
            try {
                const response = await axios.get('https://aircall-backend.onrender.com/activities');
                const relevantCalls = showAllCalls ? response.data : response.data.filter(call => !call.is_archived);
                setCalls(groupCallsByDate(relevantCalls));
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCalls();
    }, [showAllCalls, archiveChange]);

    // Groups calls by their date for organized rendering.
    const groupCallsByDate = (calls) => {
        const grouped = {};
        calls.forEach(call => {
            const date = new Date(call.created_at).toLocaleDateString();
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(call);
        });
        return grouped;
    };

    // Unarchives a call and updates the UI without needing a full refetch.
    const unarchiveCall = async (id) => {
        try {
            await axios.patch(`https://aircall-backend.onrender.com/activities/${id}`, { is_archived: false });
            const updatedCalls = {...calls};
            Object.keys(updatedCalls).forEach(date => {
                updatedCalls[date] = updatedCalls[date].map(call => call.id === id ? {...call, is_archived: false} : call);
            });
            setCalls(updatedCalls);
            alert('Call has been unarchived.');
        } catch (error) {
            console.error('Failed to unarchive call:', error);
            alert('Failed to unarchive call.');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (calls.length === 0) return <div className="no-calls">No Calls</div>;

    return (
        <div className="activity-feed">
            {Object.keys(calls).map(date => (
                <div key={date}>
                    <div className="date-separator">{date}</div>
                    <ul>
                        {calls[date].map(call => (
                            <li key={call.id} className={`call-item ${call.is_archived ? 'activity-archived' : ''}`}>
                                <FaUserCircle className="avatar" />
                                <div className="call-details">
                                    <div className="caller-info">
                                        <strong>{call.direction === 'inbound' ? call.from : call.to}</strong>
                                        <div className="call-action">
                                            {call.direction === 'inbound' ? 'tried to call on you' : 'you tried to call'}
                                        </div>
                                    </div>
                                    <div className="call-meta">
                                        <span>{new Date(call.created_at).toLocaleTimeString()}</span>
                                        {call.direction === 'inbound' ? <MdCallReceived className="call-in-icon" /> : <MdCallMade className="call-out-icon" />}
                                        {call.is_missed && <MdCallMissed className="missed-call-icon" />}
                                        {call.is_archived && (
                                            <button onClick={() => unarchiveCall(call.id)} className="unarchive-button">
                                                <MdUnarchive /> Unarchive
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default ActivityFeed;
