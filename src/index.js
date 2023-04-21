import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import {store ,persistor} from './pages/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import ContextProvider from "../src/Context/ContextProvider"
const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(

  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ContextProvider>
        <App />
      </ContextProvider>
    </PersistGate>
  </Provider>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
