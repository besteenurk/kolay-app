import { Tuple, configureStore } from '@reduxjs/toolkit';
import taskSlice from "../slices/taskSlice";

export const store = configureStore({
  reducer: {
    taskSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;