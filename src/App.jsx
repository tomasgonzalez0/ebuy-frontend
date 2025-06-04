import './App.css';
import PublishProduct from './views/PublishProduct/PublishProduct';
import Home from './views/Home/Home';
import Employee from './views/Employee/Employee';
import PlaceOrder from './views/PlaceOrder/PlaceOrder.jsx';
import RegisterSale from './views/RegisterSale/RegisterSale.jsx';
import ViewProducts from './views/ViewProducts/ViewProducts.jsx';
import Supplier from './views/Supplier/Supplier.jsx';
import AdminHome from './components/AdminHome/AdminHome.jsx';
import ProductDetail from './views/ProductDetail/ProductDetail.jsx';
import Cart from './views/Cart/Cart.jsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Login/Login.jsx';
import Register from './views/Register/Register.jsx';
import ProtectedRoute from './views/components/ProtectedRoute/ProtectedRoute.jsx';

function App() {
  return (
    <Router>
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Rutas protegidas para EMPLOYEE */}
  <Route element={<ProtectedRoute allowedRoles={["Employee"]} />}>
    <Route path="/employee" element={<Employee />}>
      <Route index element={<Navigate to="home" replace />} />
      <Route path="home" element={<AdminHome />} />
      <Route path="publish" element={<PublishProduct />} />
      <Route path="place-order" element={<PlaceOrder />} />
      <Route path="register-sale" element={<RegisterSale />} />
      <Route path="view-products" element={<ViewProducts />} />
    </Route>
  </Route>

  {/* Rutas protegidas para SUPPLIER */}
    <Route element={<ProtectedRoute allowedRoles={["Supplier"]} />}>
      <Route path="/supplier" element={<Supplier />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<AdminHome />} />
        <Route path="publish" element={<PublishProduct />} />
        <Route path="view-products" element={<ViewProducts />} />
      </Route>
    </Route>

  {/* Rutas públicas */}
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  </Router>
  );
}

export default App;
