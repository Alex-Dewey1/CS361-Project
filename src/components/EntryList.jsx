import React from 'react';

function EntryList({ entries, onDelete }) {
  const confirmDelete = (id) => {
    // IH#8: Help users be careful
    if (window.confirm("Are you sure you want to delete this entry?")) {
      onDelete(id);
    }
  };

  return (
    <ul>
      {entries.map(entry => (
        <li key={entry.id}>
          {entry.food}: {entry.calories} cal
          <button onClick={() => confirmDelete(entry.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default EntryList;