import React, { useState, useEffect } from 'react';
import { searchFoods, calculateNutrition } from '../data/entryService';

function EntryForm({ onAdd }) {
  const [food, setFood]         = useState('');
  const [calories, setCalories] = useState('');
  const [grams, setGrams]       = useState('');
  const [protein, setProtein]   = useState('');
  const [carbs, setCarbs]       = useState('');
  const [fat, setFat]           = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching]         = useState(false);
  const [macroMode, setMacroMode]         = useState('manual'); // 'manual' | 'auto'

  // Search as the user types (debounced)
  useEffect(() => {
    if (food.length < 2) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      const data = await searchFoods(food);
      setSearchResults(data.results || []);
      setSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [food]);

  // When a search result is selected, auto-fill macros if grams known
  const selectFood = async (item) => {
    setFood(item.name);
    setSearchResults([]);
    setMacroMode('auto');

    // If grams is already filled in, recalculate immediately
    const g = parseFloat(grams) || 100;
    const nutr = await calculateNutrition(item.name, g);
    if (nutr && nutr.macros) {
      setCalories(Math.round(nutr.macros.calories || 0).toString());
      setProtein((nutr.macros.protein_g || 0).toFixed(1));
      setCarbs((nutr.macros.carbs_g || 0).toFixed(1));
      setFat((nutr.macros.fat_g || 0).toFixed(1));
    }
  };

  // Recalculate when grams change (if a food is already selected)
  const handleGramsChange = async (e) => {
    const g = e.target.value;
    setGrams(g);
    if (food && parseFloat(g) > 0 && macroMode === 'auto') {
      const nutr = await calculateNutrition(food, parseFloat(g));
      if (nutr && nutr.macros) {
        setCalories(Math.round(nutr.macros.calories || 0).toString());
        setProtein((nutr.macros.protein_g || 0).toFixed(1));
        setCarbs((nutr.macros.carbs_g || 0).toFixed(1));
        setFat((nutr.macros.fat_g || 0).toFixed(1));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!food || !calories) return;

    await onAdd({
      food_name:  food,
      calories:   parseFloat(calories),
      protein_g:  parseFloat(protein) || 0,
      carbs_g:    parseFloat(carbs) || 0,
      fat_g:      parseFloat(fat) || 0,
      grams:      parseFloat(grams) || undefined,
    });

    // Reset form
    setFood(''); setCalories(''); setGrams('');
    setProtein(''); setCarbs(''); setFat('');
    setMacroMode('manual');
    setSearchResults([]);
  };

  return (
    <div style={{ marginBottom: 24, padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
      <h3 style={{ marginTop: 0 }}>Add Food Entry</h3>
      <form onSubmit={handleSubmit}>

        {/* Food search */}
        <div style={{ position: 'relative', marginBottom: 8 }}>
          <input
            placeholder="Food name (type to search)"
            value={food}
            onChange={e => { setFood(e.target.value); setMacroMode('manual'); }}
            required
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
          {searching && <small style={{ color: '#888' }}> Searching...</small>}
          {searchResults.length > 0 && (
            <ul style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              background: 'white', border: '1px solid #ccc', borderRadius: 4,
              listStyle: 'none', margin: 0, padding: 0, zIndex: 10, maxHeight: 200, overflowY: 'auto'
            }}>
              {searchResults.map(item => (
                <li
                  key={item.id}
                  onClick={() => selectFood(item)}
                  style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                  onMouseEnter={e => e.target.style.background = '#f5f5f5'}
                  onMouseLeave={e => e.target.style.background = 'white'}
                >
                  <strong>{item.name}</strong>
                  {item.num1 && <span style={{ color: '#666', marginLeft: 8 }}>{item.num1} cal/100g</span>}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Grams + Calories row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input
            type="number"
            placeholder="Grams (optional)"
            value={grams}
            onChange={handleGramsChange}
            style={{ flex: 1, padding: 8 }}
            min="0"
          />
          <input
            type="number"
            placeholder="Calories *"
            value={calories}
            onChange={e => setCalories(e.target.value)}
            required
            style={{ flex: 1, padding: 8 }}
            min="0"
          />
        </div>

        {/* Macros row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            type="number"
            placeholder="Protein (g)"
            value={protein}
            onChange={e => setProtein(e.target.value)}
            style={{ flex: 1, padding: 8 }}
            min="0" step="0.1"
          />
          <input
            type="number"
            placeholder="Carbs (g)"
            value={carbs}
            onChange={e => setCarbs(e.target.value)}
            style={{ flex: 1, padding: 8 }}
            min="0" step="0.1"
          />
          <input
            type="number"
            placeholder="Fat (g)"
            value={fat}
            onChange={e => setFat(e.target.value)}
            style={{ flex: 1, padding: 8 }}
            min="0" step="0.1"
          />
        </div>

        {macroMode === 'auto' && (
          <small style={{ color: '#4a90d9', display: 'block', marginBottom: 8 }}>
            ✓ Macros auto-filled from nutrition service
          </small>
        )}

        <button type="submit" style={{ padding: '8px 20px' }}>Add Entry</button>
      </form>
    </div>
  );
}

export default EntryForm;
