import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RiHome5Line, RiShoppingBag3Line, RiUser3Line } from 'react-icons/ri';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { TbClipboardList } from 'react-icons/tb';
import { useCart } from '../../context/CartContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { items } = useCart();

  const uniqueItemsCount = items.length;

  const navItems = [
    { path: '/', icon: RiHome5Line, label: 'Home' },
    { path: '/cart', icon: HiOutlineShoppingCart, label: 'Cart' },
    { path: '/menu', icon: RiShoppingBag3Line, label: 'Menu', isMain: true },
    { path: '/orders', icon: TbClipboardList, label: 'Orders' },
    { path: '/admin', icon: RiUser3Line, label: 'Admin' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[85px] z-50">
      <div className="max-w-[480px] mx-auto h-full relative">
        {/* Black background */}
        <div className="absolute bottom-0 left-0 right-0 h-[85px] bg-black rounded-t-[24px]" />

        {/* Navigation content */}
        <div className="absolute inset-0 px-6">
          {/* Icons container */}
          <div className="h-full w-full flex justify-between items-center">
            {navItems.map((item) => {
              if (item.isMain) return null;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="w-12 flex flex-col items-center"
                >
                  <div className={`${isActive ? 'text-[#FE4A12]' : 'text-white'}`}>
                    <div className="h-7 flex items-center justify-center">
                      <item.icon className="text-[26px]" />
                    </div>
                    {isActive && (
                      <div className="text-center">
                        <span className="text-[11px] text-white font-normal">
                          {item.label}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Menu Button */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-7">
            <Link to="/menu">
              <div className="w-[70px] h-[70px] rounded-full bg-[#FFB21A] flex items-center justify-center shadow-lg">
                <RiShoppingBag3Line className="w-8 h-8 text-white" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 