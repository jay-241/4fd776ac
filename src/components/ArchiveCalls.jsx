import React, { useState } from 'react';
import axios from 'axios';
import { IoArchiveOutline } from 'react-icons/io5'; 
import './ArchiveCalls.css';

const ArchiveCalls = ({ triggerArchiveChange }) => {
    const [archiving, setArchiving] = useState(false);

    // Handles archiving all unarchived calls. This updates the UI state and triggers data refetch.
    const archiveAllCalls = async () => {
        setArchiving(true);
        try {
            const response = await axios.get('https://aircall-backend.onrender.com/activities');
            const callsToArchive = response.data.filter(call => !call.is_archived);
            const archivePromises = callsToArchive.map(call =>
                axios.patch(`https://aircall-backend.onrender.com/activities/${call.id}`, { is_archived: true })
            );
            await Promise.all(archivePromises);
            alert('All calls have been archived.');
            triggerArchiveChange(); // Notify parent component to refresh data
        } catch (error) {
            console.error("Failed to archive calls:", error);
            alert('Failed to archive calls.');
        }
        setArchiving(false);
    };

    // Render the archive button and provide feedback when archiving.
    return (
        <div className="archive-all-calls">
            <IoArchiveOutline onClick={archiveAllCalls} className={`archive-icon ${archiving ? 'archiving' : ''}`} />
            <span onClick={archiveAllCalls} className="archive-text">{archiving ? 'Archiving...' : 'Archive all calls'}</span>
        </div>
    );
};

export default ArchiveCalls;
