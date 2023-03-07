import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { ConfigProvider } from 'antd';

/* eslint-disable */
import store from 'redux/store';
import App from 'App';
import 'assets/scss/_index.scss';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <BrowserRouter basename='/'>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#689F3A',
          },
        }}      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </Provider>,
);
