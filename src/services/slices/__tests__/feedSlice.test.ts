import feedSlice, {
  fetchFeeds,
  getOrderByNumber,
  clearFeed
} from '../feedSlice';
import { TOrder } from '@utils-types';

describe('feedSlice reducer', () => {
  const initialState = feedSlice.getInitialState();

  const mockOrders: TOrder[] = [
    {
      _id: '1',
      ingredients: [],
      status: 'done',
      number: 1,
      name: 'Заказ 1',
      createdAt: '',
      updatedAt: ''
    },
    {
      _id: '2',
      ingredients: [],
      status: 'pending',
      number: 2,
      name: 'Заказ 2',
      createdAt: '',
      updatedAt: ''
    }
  ];

  const mockFeedData = {
    orders: mockOrders,
    total: 10,
    totalToday: 5
  };

  const mockOrder = mockOrders[0];

  it('clearFeed очищает стейт', () => {
    const filledState = {
      ...initialState,
      orders: mockOrders,
      total: 10,
      totalToday: 5,
      error: 'Ошибка'
    };
    const state = feedSlice.reducer(filledState, clearFeed());
    expect(state.orders).toEqual([]);
    expect(state.total).toBe(0);
    expect(state.totalToday).toBe(0);
    expect(state.error).toBeNull();
  });

  it('fetchFeeds.pending устанавливает loading в true и error в null', () => {
    const action = { type: fetchFeeds.pending.type };
    const state = feedSlice.reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchFeeds.fulfilled сохраняет данные и сбрасывает loading', () => {
    const action = { type: fetchFeeds.fulfilled.type, payload: mockFeedData };
    const state = feedSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.total).toBe(10);
    expect(state.totalToday).toBe(5);
  });

  it('fetchFeeds.rejected сохраняет ошибку и сбрасывает loading', () => {
    const action = {
      type: fetchFeeds.rejected.type,
      payload: 'Ошибка загрузки'
    };
    const state = feedSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });

  it('getOrderByNumber.pending устанавливает loading в true и error в null', () => {
    const action = { type: getOrderByNumber.pending.type };
    const state = feedSlice.reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('getOrderByNumber.fulfilled сохраняет текущий заказ и сбрасывает loading', () => {
    const action = {
      type: getOrderByNumber.fulfilled.type,
      payload: mockOrder
    };
    const state = feedSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.currentOrder).toEqual(mockOrder);
  });

  it('getOrderByNumber.rejected сохраняет ошибку и сбрасывает loading', () => {
    const action = {
      type: getOrderByNumber.rejected.type,
      payload: 'Ошибка заказа'
    };
    const state = feedSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка заказа');
  });
});
