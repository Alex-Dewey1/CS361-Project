import React, { useState } from 'react';

function EntryForm({ onAdd }) {
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ food, calories: parseInt(calories) });
    setFood('');
    setCalories('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Food" value={food} onChange={e => setFood(e.target.value)} required />
      <input type="number" placeholder="Calories" value={calories} onChange={e => setCalories(e.target.value)} required />
      <button type="submit">Add Entry</button>
    </form>
  );
}

export default EntryForm;