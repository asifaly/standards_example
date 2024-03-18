import React from 'react';
import logo from './logo.svg';
import './App.css';
import "./index.css";
import Login from './Features/Login/Login';
import RouterPage from './Features/Routes/RouterPage'
import { ConfigProvider, Layout } from 'antd';
function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
        fontFamily:"Poppins"
      }
    }}
    >
      <RouterPage />
    </ConfigProvider>
  );
}

export default App;
