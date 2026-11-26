import { configureStore } from '@reduxjs/toolkit';
import matchesReducer from './features/matchesSlice';
import goalReducer from './features/goalSlice';
import { loadSaved, saveMatches } from './storage';

const initialSaved = loadSaved();
export const hasSaved = initialSaved !== null;

export const store = configureStore({
  reducer: {
    matches: matchesReducer,
    goal: goalReducer,
  },
  preloadedState: {
    matches: initialSaved ?? [],
  },
});

let currentMatches = store.getState().matches;
store.subscribe(() => {
  const nextMatches = store.getState().matches;
  if (nextMatches !== currentMatches) {
    currentMatches = nextMatches;
    saveMatches(nextMatches);
  }
});