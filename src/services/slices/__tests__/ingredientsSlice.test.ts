import ingredientsSlice, { fetchIngredients } from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice reducer', () => {
  const initialState = ingredientsSlice.getInitialState();

  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Булка R2-D3',
      type: 'bun',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 100,
      image: '',
      image_large: '',
      image_mobile: ''
    },
    {
      _id: '2',
      name: 'Котлета',
      type: 'main',
      proteins: 20,
      fat: 5,
      carbohydrates: 0,
      calories: 200,
      price: 300,
      image: '',
      image_large: '',
      image_mobile: ''
    }
  ];

  it('устанавливает loading в true при fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsSlice.reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('сохраняет данные и ставит loading в false при fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  it('сохраняет ошибку и ставит loading в false при fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      payload: 'Ошибка загрузки'
    };
    const state = ingredientsSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
