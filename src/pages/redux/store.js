import {configureStore} from '@reduxjs/toolkit'
import cartReducer from '../redux/cartRedux'
import userReducer from './userRedux.js'
import RegisteruserRedux from './RegisteruserRedux'
import productSlice from './productSlice' 
import orderSlice from './orderSlice'

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import influencerRedux from './influencerRedux'

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
  }
  
const persistedReducers = persistReducer(persistConfig, userReducer);
const sellerpersistedReducer = persistReducer(persistConfig, RegisteruserRedux);
const influencerpersistedReducer = persistReducer(persistConfig, influencerRedux);

export const store = configureStore ({
    reducer:{
        cart: cartReducer,
        user: persistedReducers,
        seller: sellerpersistedReducer,
        product: productSlice,
        orders : orderSlice,
        influencer:influencerpersistedReducer
        
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store)
