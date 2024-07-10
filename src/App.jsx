import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Header from './Header.jsx';
import NavBar from './components/NavBar.jsx';
import ActivityFeed from './components/ActivityFeed.jsx';
import ArchiveCalls from './components/ArchiveCalls.jsx';

// Main App component for managing the UI state.
const App = () => {
  const [showAllCalls, setShowAllCalls] = useState(false);

  const [archiveChange, setArchiveChange] = useState(0);

  const handleTabChange = (showAll) => {
    setShowAllCalls(showAll);
  };

  // Triggers a re-fetch of call data in ActivityFeed.
  const triggerArchiveChange = () => {
    setArchiveChange(prev => prev + 1);
  };

  // App layout structure.
  return (
    <div className='container'>
      <Header />
      <NavBar onTabChange={handleTabChange} />
      <ArchiveCalls triggerArchiveChange={triggerArchiveChange} />
      <ActivityFeed showAllCalls={showAllCalls} archiveChange={archiveChange} />
    </div>
  );
};

// Renders the App component into the DOM.
ReactDOM.render(<App />, document.getElementById('app'));

export default App;
