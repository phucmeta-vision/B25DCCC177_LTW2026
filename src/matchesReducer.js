export const matchesReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD':
      return [...action.payload];
    case 'ADD': {
      const maxId = state.reduce((max, m) => (m.id > max ? m.id : max), 0);
      return [...state, { ...action.payload, id: maxId + 1 }];
    }
    case 'REMOVE':
      return state.filter((m) => m.id !== action.payload);
    case 'SET_GOALS':
      return state.map((m) =>
        m.id === action.payload.id
          ? { ...m, homeGoals: action.payload.homeGoals, awayGoals: action.payload.awayGoals }
          : m
      );
    default:
      return state;
  }
};