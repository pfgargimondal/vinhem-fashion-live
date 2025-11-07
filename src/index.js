import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { FilterProvider } from './context/FilterContext';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <CurrencyProvider>
        <AuthProvider>
          <FilterProvider>
            <CartProvider>
              <WishlistProvider>
                <PayPalScriptProvider options={{ "client-id": "Ac3LBYSEf-1c0Y37LZOTUEZgOdN_k05H_tU50qLlU2lfrHGK0w4VV6FuJYY5jBb3faC3O5FwZsgExAVp" }}>
                  <App />
                </PayPalScriptProvider>
              </WishlistProvider>
            </CartProvider>
          </FilterProvider>
        </AuthProvider>
      </CurrencyProvider>
    </Router>
  </React.StrictMode>
);