// A simple array to hold data
let entries = [
  { id: 1, food: "Oatmeal", calories: 150 },
];

export const getEntries = () => [...entries];

export const addEntry = (newEntry) => {
  entries.push({ id: Date.now(), ...newEntry });
};

export const deleteEntry = (id) => {
  entries = entries.filter(entry => entry.id !== id);
  return entries;
};