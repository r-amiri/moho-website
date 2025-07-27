import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Nav = styled.nav`
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.lg};
  }
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  display: flex;
  align-items: center;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const NavLinks = styled.div`
  display: none;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
    align-items: center;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.dark};
  text-decoration: none;
  font-weight: ${({ $active }) => $active ? '600' : '500'};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  transition: all 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.lightGray};
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const UserButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.large};
  min-width: 200px;
  display: ${({ $isOpen }) => $isOpen ? 'block' : 'none'};
  z-index: 1000;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.dark};
  text-decoration: none;
  transition: background 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.lightGray};
  }

  &:first-child {
    border-top-left-radius: ${({ theme }) => theme.borderRadius.medium};
    border-top-right-radius: ${({ theme }) => theme.borderRadius.medium};
  }

  &:last-child {
    border-bottom-left-radius: ${({ theme }) => theme.borderRadius.medium};
    border-bottom-right-radius: ${({ theme }) => theme.borderRadius.medium};
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  text-align: right;
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.lightGray};
  }
`;

const MobileMenuButton = styled.button`
  display: flex;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }

  span {
    width: 25px;
    height: 3px;
    background: ${({ theme }) => theme.colors.dark};
    margin: 3px 0;
    transition: 0.3s;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => $isOpen ? 'block' : 'none'};
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  padding: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)`
  display: block;
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.dark};
  text-decoration: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};

  &:hover {
    background: ${({ theme }) => theme.colors.lightGray};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">بیمه امیری</Logo>

        <NavLinks>
          <NavLink to="/" $active={isActive('/')}>صفحه اصلی</NavLink>
          <NavLink to="/insurance-plans" $active={isActive('/insurance-plans')}>طرح‌های بیمه</NavLink>
          <NavLink to="/quote" $active={isActive('/quote')}>دریافت قیمت</NavLink>
          
          {isAuthenticated && (
            <>
              <NavLink to="/dashboard" $active={isActive('/dashboard')}>داشبورد</NavLink>
              <NavLink to="/policies" $active={isActive('/policies')}>بیمه‌نامه‌ها</NavLink>
              <NavLink to="/claims" $active={isActive('/claims')}>خسارت‌ها</NavLink>
            </>
          )}
        </NavLinks>

        <UserMenu>
          {isAuthenticated ? (
            <>
              <UserButton onClick={() => setUserMenuOpen(!userMenuOpen)}>
                {user?.name || 'کاربر'} ▼
              </UserButton>
              <DropdownMenu $isOpen={userMenuOpen}>
                <DropdownItem to="/dashboard" onClick={() => setUserMenuOpen(false)}>
                  داشبورد
                </DropdownItem>
                <DropdownItem to="/profile" onClick={() => setUserMenuOpen(false)}>
                  پروفایل
                </DropdownItem>
                <DropdownItem to="/policies" onClick={() => setUserMenuOpen(false)}>
                  بیمه‌نامه‌ها
                </DropdownItem>
                <DropdownItem to="/payments" onClick={() => setUserMenuOpen(false)}>
                  تاریخچه پرداخت
                </DropdownItem>
                <LogoutButton onClick={handleLogout}>
                  خروج از حساب
                </LogoutButton>
              </DropdownMenu>
            </>
          ) : (
            <>
              <NavLink to="/login">ورود</NavLink>
              <UserButton as={Link} to="/register">
                ثبت‌نام
              </UserButton>
            </>
          )}

          <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </MobileMenuButton>
        </UserMenu>

        <MobileMenu $isOpen={mobileMenuOpen}>
          <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>
            صفحه اصلی
          </MobileNavLink>
          <MobileNavLink to="/insurance-plans" onClick={() => setMobileMenuOpen(false)}>
            طرح‌های بیمه
          </MobileNavLink>
          <MobileNavLink to="/quote" onClick={() => setMobileMenuOpen(false)}>
            دریافت قیمت
          </MobileNavLink>
          
          {isAuthenticated ? (
            <>
              <MobileNavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                داشبورد
              </MobileNavLink>
              <MobileNavLink to="/policies" onClick={() => setMobileMenuOpen(false)}>
                بیمه‌نامه‌ها
              </MobileNavLink>
              <MobileNavLink to="/claims" onClick={() => setMobileMenuOpen(false)}>
                خسارت‌ها
              </MobileNavLink>
              <MobileNavLink to="/profile" onClick={() => setMobileMenuOpen(false)}>
                پروفایل
              </MobileNavLink>
              <LogoutButton onClick={handleLogout}>
                خروج از حساب
              </LogoutButton>
            </>
          ) : (
            <>
              <MobileNavLink to="/login" onClick={() => setMobileMenuOpen(false)}>
                ورود
              </MobileNavLink>
              <MobileNavLink to="/register" onClick={() => setMobileMenuOpen(false)}>
                ثبت‌نام
              </MobileNavLink>
            </>
          )}
        </MobileMenu>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;