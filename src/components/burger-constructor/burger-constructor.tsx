import { FC, useMemo } from 'react';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  selectConstructorItems,
  selectOrderRequest,
  selectOrderModalData,
  createOrder,
  clearConstructor,
  closeOrderModal
} from '../../services/slices/constructorSlice';
import { fetchProfileOrders } from '../../services/slices/profileSlice';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { selectUser } from '../../services/slices/authSlice';
import { useLocation, useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const user = useSelector(selectUser);

  const safeConstructorItems = useMemo(
    () =>
      constructorItems || {
        bun: null,
        ingredients: []
      },
    [constructorItems]
  );

  const onOrderClick = () => {
    if (!user) {
      navigate('/login', { replace: true, state: { from: location } });
      return;
    }
    if (!safeConstructorItems.bun || orderRequest) return;

    const ingredientIds = [
      safeConstructorItems.bun._id,
      ...safeConstructorItems.ingredients.map(
        (ingredient: TConstructorIngredient) => ingredient._id
      ),
      safeConstructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds));
  };

  const handleCloseOrderModal = () => {
    dispatch(closeOrderModal());
    dispatch(clearConstructor());
    dispatch(fetchProfileOrders());
    dispatch(fetchFeeds());
  };

  const price = useMemo(() => {
    if (!safeConstructorItems.bun) {
      return safeConstructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      );
    }

    return (
      safeConstructorItems.bun.price * 2 +
      safeConstructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      )
    );
  }, [safeConstructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={safeConstructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={handleCloseOrderModal}
    />
  );
};
