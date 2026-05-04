import React from 'react';

function StatsDashboard({ entries }) {
  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);

  return (
    <div>
      <h3>Total Daily Calories: {totalCalories}</h3>
    </div>
  );
}

export default StatsDashboard;