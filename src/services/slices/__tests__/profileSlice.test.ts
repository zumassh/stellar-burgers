import profileSlice, { fetchProfileOrders } from '../profileSlice';
import { TOrder } from '@utils-types';

describe('profileSlice reducer', () => {
  const initialState = profileSlice.getInitialState();

  const mockOrders: TOrder[] = [
    {
      _id: '1',
      ingredients: ['ing1', 'ing2'],
      status: 'done',
      number: 101,
      name: 'Заказ 1',
      createdAt: '2025-10-28T12:00:00Z',
      updatedAt: '2025-10-28T12:00:00Z'
    },
    {
      _id: '2',
      ingredients: ['ing3'],
      status: 'pending',
      number: 102,
      name: 'Заказ 2',
      createdAt: '2025-10-28T12:30:00Z',
      updatedAt: '2025-10-28T12:30:00Z'
    }
  ];

  it('fetchProfileOrders.pending устанавливает loading в true и error в null', () => {
    const action = { type: fetchProfileOrders.pending.type };
    const state = profileSlice.reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchProfileOrders.fulfilled сохраняет заказы и сбрасывает loading', () => {
    const action = {
      type: fetchProfileOrders.fulfilled.type,
      payload: mockOrders
    };
    const state = profileSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
  });

  it('fetchProfileOrders.rejected сохраняет ошибку и сбрасывает loading', () => {
    const action = {
      type: fetchProfileOrders.rejected.type,
      payload: 'Ошибка загрузки'
    };
    const state = profileSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
