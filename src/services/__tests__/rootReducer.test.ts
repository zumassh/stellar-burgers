import store from '../store';
import { combineSlices } from '@reduxjs/toolkit';
import authSlice from '../slices/authSlice';
import ingredientsSlice from '../slices/ingredientsSlice';
import constructorSlice from '../slices/constructorSlice';
import feedSlice from '../slices/feedSlice';
import profileSlice from '../slices/profileSlice';

describe('rootReducer', () => {
  it('инициализация состояния', () => {
    const state = store.getState();

    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('profile');
  });

  it('корректные начальные значения', () => {
    const { burgerConstructor } = store.getState();

    expect(burgerConstructor.items.bun).toBeNull();
    expect(burgerConstructor.items.ingredients).toEqual([]);
    expect(burgerConstructor.orderRequest).toBe(false);
    expect(burgerConstructor.orderModalData).toBeNull();
    expect(burgerConstructor.error).toBeNull();
  });

  it('корректное начальное состояние при неизвестном экшене', () => {
    const rootReducer = combineSlices({
      auth: authSlice.reducer,
      ingredients: ingredientsSlice.reducer,
      burgerConstructor: constructorSlice.reducer,
      feed: feedSlice.reducer,
      profile: profileSlice.reducer
    });

    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    
    const initialState = store.getState();
    expect(state).toEqual(initialState);
  });
});
