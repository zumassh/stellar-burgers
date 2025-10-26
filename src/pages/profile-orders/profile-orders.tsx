import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectProfileOrders,
  fetchProfileOrders
} from '../../services/slices/profileSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectProfileOrders);

  useEffect(() => {
    if (!orders.length) {
      dispatch(fetchProfileOrders());
    }
  }, [dispatch, orders.length]);

  return <ProfileOrdersUI orders={orders} />;
};
