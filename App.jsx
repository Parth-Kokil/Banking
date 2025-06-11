import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CustomerLogin from './pages/CustomerLogin';
import CustomerRegister from './pages/CustomerRegister';
import BankerLogin from './pages/BankerLogin';
import Transactions from './pages/Transactions';
import AccountsList from './pages/AccountsList';
import CreateCustomer from './pages/CreateCustomer'; // new import
import { useState } from 'react';
import BankerRegister from './pages/BankerRegister';

function App() {
  const [token, setToken] = useState('')
  const [role, setRole] = useState('')
  // const role = localStorage.getItem('role'); // "customer" or "banker"
  console.log("role", role)
  console.log("token", token)
  return (
    <BrowserRouter>
      <Routes>
        {/* Home: redirect based on role */}
        <Route
          path="/"
          element={
            token && role === 'customer'
              ? <Navigate to="/transactions" replace />
              : token && role === 'banker'
                ? <Navigate to="/banker/accounts" replace />
                : <Navigate to="/customer-login" replace />
          }
        />

        {/* Customer Login & Register */}
        <Route
          path="/customer-login"
          element={token && role === 'customer' ? <Navigate to="/transactions" /> : <CustomerLogin setRole={setRole} setToken={setToken} />}
        />
        <Route
          path="/customer-register"
          element={token && role === 'customer' ? <Navigate to="/transactions" /> : <CustomerRegister />}
        />

        {/* Banker Login */}
        <Route
          path="/banker-login"
          element={token && role === 'banker' ? <Navigate to="/banker/accounts" /> : <BankerLogin setRole={setRole} setToken={setToken} />}
        />
        <Route
          path="/banker-register"
          element={token && role === 'banker' ? <Navigate to="/banker/accounts" /> : <BankerRegister setRole={setRole} setToken={setToken}  />}
        />
        {/* Protected: Customer Transactions */}
        <Route
          path="/transactions"
          element={token && role === 'customer' ? <Transactions /> : <Navigate to="/customer-login" />}
        />

        {/* Protected: Banker Accounts List */}
        <Route
          path="/banker/accounts"
          element={token && role === 'banker' ? <AccountsList /> : <Navigate to="/banker-login" />}
        />

        {/* Protected: Banker Create Customer */}
        <Route
          path="/banker/create-customer"
          element={token && role === 'banker' ? <CreateCustomer /> : <Navigate to="/banker-login" />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;