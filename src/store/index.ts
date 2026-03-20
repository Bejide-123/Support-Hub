import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/Auth/authSlice';
import ticketsReducer from '../features/Tickets/ticketsSlice';

export const store = configureStore({
      reducer: {
            auth: authReducer,
            tickets: ticketsReducer,
      },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;