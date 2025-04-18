import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home';
import Menu from './pages/Menu';
import AdminPage from './pages/Admin';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import QRLanding from './pages/QRLanding';
import Splash from './pages/Splash';
import InitialLanding from './pages/InitialLanding';
import DishDetails from './pages/DishDetails';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { OrderProvider } from './context/OrderContext';
import Navigation from './components/ui/Navigation';
import { FirebaseProvider } from './context/FirebaseContext';
import FirebaseMigration from './pages/FirebaseMigration';
import DataMigration from './pages/DataMigration';
import AdminOrders from './pages/AdminOrders';
import { UserProvider } from './context/UserContext';

const queryClient = new QueryClient();

// Smooth page transitions
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.33, 1, 0.68, 1],  // Custom cubic-bezier
      when: "beforeChildren",
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.33, 1, 0.68, 1],
    }
  }
};

// Stagger children animations
const containerVariants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

function AppRoutes() {
  const location = useLocation();
  const showNav = !location.pathname.startsWith('/dish/') && 
                 !['/qr', '/splash', '/initial'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <div className="max-w-[480px] mx-auto min-h-screen bg-white relative pb-24">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="min-h-screen w-full"
          >
            <Routes location={location}>
              <Route path="/qr" element={<QRLanding />} />
              <Route path="/splash" element={<Splash />} />
              <Route path="/initial" element={<InitialLanding />} />
              <Route path="/" element={
                <motion.div variants={containerVariants}>
                  <Home />
                </motion.div>
              } />
              <Route path="/menu" element={
                <motion.div variants={containerVariants}>
                  <Menu />
                </motion.div>
              } />
              <Route path="/admin" element={
                <motion.div variants={containerVariants}>
                  <AdminPage />
                </motion.div>
              } />
              <Route path="/cart" element={
                <motion.div variants={containerVariants}>
                  <Cart />
                </motion.div>
              } />
              <Route path="/orders" element={
                <motion.div variants={containerVariants}>
                  <Orders />
                </motion.div>
              } />
              <Route path="/admin/orders" element={
                <motion.div variants={containerVariants}>
                  <AdminOrders />
                </motion.div>
              } />
              <Route path="/dish/:id" element={<DishDetails />} />
              <Route path="/firebase-migration" element={<FirebaseMigration />} />
              <Route path="/migrate" element={<DataMigration />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
        {showNav && <Navigation />}
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <FirebaseProvider>
          <UserProvider>
            <CartProvider>
              <OrderProvider>
                <Router>
                  <AppRoutes />
                </Router>
              </OrderProvider>
            </CartProvider>
          </UserProvider>
        </FirebaseProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App; 