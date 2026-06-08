import React, { useState } from 'react';
import { getRandomRecipe } from '../data/entryService';

function StatsDashboard({ entries, totals }) {
  const [recipe, setRecipe] = useState(null);
  const [loadingRecipe, setLoadingRecipe] = useState(false);

  const fetchRecipe = async () => {
    setLoadingRecipe(true);
    const r = await getRandomRecipe();
    setRecipe(r);
    setLoadingRecipe(false);
  };

  // Use totals from statistics microservice (accurate, persisted)
  const totalCalories = totals.calories || entries.reduce((s, e) => s + (e.calories || 0), 0);
  const totalProtein  = totals.protein_g || 0;
  const totalCarbs    = totals.carbs_g || 0;
  const totalFat      = totals.fat_g || 0;

  return (
    <div style={{ marginBottom: 24, padding: 16, background: '#f8f9fa', borderRadius: 8 }}>
      <h3 style={{ marginTop: 0 }}>Today's Totals</h3>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <Stat label="Calories" value={Math.round(totalCalories)} unit="kcal" highlight />
        <Stat label="Protein"  value={totalProtein.toFixed(1)} unit="g" />
        <Stat label="Carbs"    value={totalCarbs.toFixed(1)} unit="g" />
        <Stat label="Fat"      value={totalFat.toFixed(1)} unit="g" />
        <Stat label="Entries"  value={entries.length} unit="logged" />
      </div>

      <div style={{ marginTop: 16 }}>
        <button onClick={fetchRecipe} disabled={loadingRecipe} style={{ padding: '6px 14px' }}>
          {loadingRecipe ? 'Loading...' : '🍽 Get Recipe Suggestion'}
        </button>
        {recipe && (
          <div style={{ marginTop: 12, padding: 12, background: 'white', borderRadius: 6, border: '1px solid #ddd' }}>
            <strong>{recipe.title}</strong>
            <p style={{ marginBottom: 4, color: '#555' }}>Ingredients:</p>
            <ul style={{ marginTop: 4 }}>
              {(recipe.ingredients || []).map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
            <p style={{ marginBottom: 4, color: '#555' }}>Instructions:</p>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13 }}>{recipe.instructions}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, unit, highlight }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: highlight ? 28 : 22,
        fontWeight: 600,
        color: highlight ? '#2c7be5' : '#333'
      }}>
        {value}
        <span style={{ fontSize: 13, fontWeight: 400, color: '#888', marginLeft: 3 }}>{unit}</span>
      </div>
      <div style={{ fontSize: 12, color: '#666' }}>{label}</div>
    </div>
  );
}

export default StatsDashboard;
