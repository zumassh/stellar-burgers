import authSlice, {
  loginUser,
  registerUser,
  fetchUser,
  logoutUser,
  updateUser,
  setAuthChecked
} from '../authSlice';
import { TUser } from '@utils-types';

describe('authSlice reducer', () => {
  beforeAll(() => {
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });

    Object.defineProperty(global, 'document', {
      value: {
        cookie: ''
      },
      writable: true
    });
  });

  const initialState = authSlice.getInitialState();

  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  it('должен устанавливать isAuthChecked через setAuthChecked', () => {
    const state = authSlice.reducer(initialState, setAuthChecked(true));
    expect(state.isAuthChecked).toBe(true);
  });

  it('loginUser.pending устанавливает loading в true и error в null', () => {
    const action = { type: loginUser.pending.type };
    const state = authSlice.reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('loginUser.fulfilled сохраняет пользователя и сбрасывает loading', () => {
    const action = { type: loginUser.fulfilled.type, payload: mockUser };
    const state = authSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('loginUser.rejected сохраняет ошибку и сбрасывает loading', () => {
    const action = { type: loginUser.rejected.type, payload: 'Ошибка входа' };
    const state = authSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка входа');
  });

  it('registerUser.fulfilled сохраняет пользователя и устанавливает isAuthChecked', () => {
    const action = { type: registerUser.fulfilled.type, payload: mockUser };
    const state = authSlice.reducer(initialState, action);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('fetchUser.fulfilled сохраняет пользователя и устанавливает isAuthChecked', () => {
    const action = { type: fetchUser.fulfilled.type, payload: mockUser };
    const state = authSlice.reducer(initialState, action);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('fetchUser.rejected сбрасывает пользователя и устанавливает isAuthChecked', () => {
    const action = { type: fetchUser.rejected.type };
    const state = authSlice.reducer(initialState, action);
    expect(state.user).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });

  it('logoutUser.fulfilled сбрасывает пользователя и очищает localStorage', () => {
    const prevState = { ...initialState, user: mockUser };
    const action = { type: logoutUser.fulfilled.type };
    const state = authSlice.reducer(prevState, action);
    expect(state.user).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });

  it('updateUser.pending устанавливает loading в true и error в null', () => {
    const action = { type: updateUser.pending.type };
    const state = authSlice.reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('updateUser.fulfilled обновляет пользователя и сбрасывает loading', () => {
    const updatedUser = { ...mockUser, name: 'Updated' };
    const action = { type: updateUser.fulfilled.type, payload: updatedUser };
    const state = authSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(updatedUser);
  });

  it('updateUser.rejected сохраняет ошибку и сбрасывает loading', () => {
    const action = {
      type: updateUser.rejected.type,
      payload: 'Ошибка обновления'
    };
    const state = authSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка обновления');
  });
});
