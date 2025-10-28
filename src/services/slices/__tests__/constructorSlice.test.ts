import constructorSlice, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  closeOrderModal,
  createOrder
} from '../constructorSlice';
import { TIngredient } from '@utils-types';

describe('burgerConstructor reducer', () => {
  const bun: TIngredient = {
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
  };

  const ingredient: TIngredient = {
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
  };

  const initialState = constructorSlice.getInitialState();

  it('добавляет булку', () => {
    const state = constructorSlice.reducer(initialState, addBun(bun));
    expect(state.items.bun).toEqual(bun);
  });

  it('добавляет ингредиент', () => {
    const state = constructorSlice.reducer(
      initialState,
      addIngredient(ingredient)
    );
    expect(state.items.ingredients).toHaveLength(1);
    expect(state.items.ingredients[0]._id).toBe('2');
  });

  it('удаляет ингредиент по id', () => {
    const added = constructorSlice.reducer(
      initialState,
      addIngredient(ingredient)
    );
    const idToRemove = added.items.ingredients[0].id;
    const state = constructorSlice.reducer(added, removeIngredient(idToRemove));
    expect(state.items.ingredients).toHaveLength(0);
  });

  it('изменяет порядок ингредиентов', () => {
    const first = constructorSlice.reducer(
      initialState,
      addIngredient({ ...ingredient, _id: 'a' })
    );
    const second = constructorSlice.reducer(
      first,
      addIngredient({ ...ingredient, _id: 'b' })
    );
    const moved = constructorSlice.reducer(
      second,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(moved.items.ingredients[0]._id).toBe('b');
    expect(moved.items.ingredients[1]._id).toBe('a');
  });
});
