/**
 * entryService.js
 * ================
 * All data now comes from the backend server (server.py on port 5000),
 * which in turn communicates with the four microservices.
 *
 * NO direct calls to microservices from the frontend — all go through server.py.
 */

const API = "/api";

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function register(username, password) {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function login(username, password) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return { data: await res.json(), ok: res.ok };
}

export async function logout() {
  await fetch(`${API}/logout`, { method: "POST", credentials: "include" });
}

export async function getMe() {
  try {
    const res = await fetch(`${API}/me`, { credentials: "include" });
    if (!res.ok) return null;
    return (await res.json()).username;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Food log (statistics microservice via server.py)
// ---------------------------------------------------------------------------

/**
 * Get all log entries + daily totals for a given date.
 * Returns: { entries: [{id, food, calories, protein_g, ...}], totals: {calories, ...}, date }
 */
export async function getEntries(dateStr) {
  const params = dateStr ? `?date=${dateStr}` : "";
  const res = await fetch(`${API}/entries${params}`, { credentials: "include" });
  if (!res.ok) return { entries: [], totals: {} };
  return res.json();
}

/**
 * Log a food item.
 * @param {object} entry  - { food_name, calories, protein_g?, carbs_g?, fat_g?, grams? }
 */
export async function addEntry(entry) {
  const res = await fetch(`${API}/log`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  return { data: await res.json(), ok: res.ok };
}

/**
 * Delete a log entry by its ID.
 */
export async function deleteEntry(id) {
  const res = await fetch(`${API}/log?entry_id=${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.ok;
}

// ---------------------------------------------------------------------------
// Nutrition (nutritional-data-microservice via server.py)
// ---------------------------------------------------------------------------

/**
 * Get macro info for a food (per 100g).
 * Returns: { food, macros: { calories, protein_g, carbs_g, fat_g, ... } }
 */
export async function getNutrition(foodName) {
  const res = await fetch(
    `${API}/nutrition?food=${encodeURIComponent(foodName)}`,
    { credentials: "include" }
  );
  if (!res.ok) return null;
  return res.json();
}

/**
 * Calculate macros for a specific portion (grams).
 */
export async function calculateNutrition(foodName, grams) {
  const res = await fetch(
    `${API}/nutrition/calculate?food=${encodeURIComponent(foodName)}&grams=${grams}`,
    { credentials: "include" }
  );
  if (!res.ok) return null;
  return res.json();
}

/**
 * Get a random recipe suggestion.
 */
export async function getRandomRecipe(category) {
  const params = category ? `?category=${category}` : "";
  const res = await fetch(`${API}/recipe/random${params}`, { credentials: "include" });
  if (!res.ok) return null;
  return res.json();
}

// ---------------------------------------------------------------------------
// Search (search-filter-microservice via server.py)
// ---------------------------------------------------------------------------

/**
 * Search for foods.
 * @param {string} query          - Keyword search
 * @param {object} filters        - { category, max_calories, min_protein }
 */
export async function searchFoods(query, filters = {}) {
  const params = new URLSearchParams({ q: query });
  if (filters.category) params.set("category", filters.category);
  if (filters.max_calories) params.set("max_calories", filters.max_calories);
  if (filters.min_protein) params.set("min_protein", filters.min_protein);
  const res = await fetch(`${API}/search?${params}`, { credentials: "include" });
  if (!res.ok) return { results: [] };
  return res.json();
}

/**
 * Get available filter options (categories, etc.)
 */
export async function getSearchFilters() {
  const res = await fetch(`${API}/search/filters`, { credentials: "include" });
  if (!res.ok) return {};
  return res.json();
}

// ---------------------------------------------------------------------------
// Statistics (statistics-microservice via server.py)
// ---------------------------------------------------------------------------

/**
 * Get aggregated totals for a date.
 */
export async function getDailyStats(dateStr) {
  const params = dateStr ? `?date=${dateStr}` : "";
  const res = await fetch(`${API}/stats/daily${params}`, { credentials: "include" });
  if (!res.ok) return null;
  return res.json();
}

/**
 * Get history over a date range.
 * @param {string} start  - YYYY-MM-DD
 * @param {string} end    - YYYY-MM-DD
 */
export async function getStatsHistory(start, end) {
  const res = await fetch(`${API}/stats/history?start=${start}&end=${end}`, {
    credentials: "include",
  });
  if (!res.ok) return null;
  return res.json();
}
