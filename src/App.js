import React, { useState } from 'react';
import { getEntries, addEntry, deleteEntry } from './data/entryService';
import EntryForm from './components/EntryForm';
import EntryList from './components/EntryList';
import StatsDashboard from './components/StatsDashboard';

function App() {
  // Initialize state with data from service
  const [entries, setEntries] = useState(getEntries());

  const handleAdd = (newEntry) => {
    addEntry(newEntry);
    setEntries(getEntries()); // Refresh state
  };

  const handleDelete = (id) => {
    deleteEntry(id);
    setEntries(getEntries()); // Refresh state
  };

  return (
    <div>
      <h1>Calorie Tracker</h1>
      <StatsDashboard entries={entries} />
      <EntryForm onAdd={handleAdd} />
      <EntryList entries={entries} onDelete={handleDelete} />
    </div>
  );
}

export default App;