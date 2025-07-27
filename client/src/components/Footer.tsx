import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: ${({ theme }) => theme.colors.dark};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xxl} 0 ${({ theme }) => theme.spacing.lg} 0;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const FooterSection = styled.div`
  h3 {
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    font-size: 1.25rem;
  }

  p {
    line-height: 1.7;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  a {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.mediumGray};
  padding-top: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.lightGray};
`;

const AppLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const AppLink = styled.a`
  display: inline-block;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-2px);
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          {/* Company Info */}
          <FooterSection>
            <h3>بیمه امیری</h3>
            <p>
              سامانه تمام الکترونیک انتخاب و خرید مناسب‌ترین خدمات بیمه. هدف ما این است که شما خدمات بیمه‌ای را با آگاهی کامل، مناسب‌ترین قیمت و بهترین خدمات پس از فروش دریافت نمایید.
            </p>
            <div>
              <h4 style={{ marginBottom: '1rem', color: '#87cfd1' }}>نرم‌افزار ما را نصب کنید.</h4>
              <AppLinks>
                <AppLink href="#" target="_blank">دانلود مستقیم</AppLink>
              </AppLinks>
            </div>
          </FooterSection>

          {/* Quick Access */}
          <FooterSection>
            <h3>دسترسی سریع</h3>
            <FooterLinks>
              <li><Link to="/claims">خسارت آنلاین</Link></li>
              <li><a href="#agents">پنل نمایندگان</a></li>
              <li><a href="#magazine">مجله بیمه امیری</a></li>
              <li><a href="#faq">سوالات متداول</a></li>
            </FooterLinks>
          </FooterSection>

          {/* Contact & Legal */}
          <FooterSection>
            <h3>ارتباط با ما</h3>
            <FooterLinks>
              <li><a href="#agency-request">درخواست نمایندگی</a></li>
              <li><a href="#terms">شرایط و قوانین</a></li>
              <li><a href="#contact">تماس با ما</a></li>
              <li><a href="#about">درباره ما</a></li>
            </FooterLinks>
          </FooterSection>

          {/* Insurance Plans */}
          <FooterSection>
            <h3>خدمات بیمه‌ای</h3>
            <FooterLinks>
              <li><Link to="/insurance-plans">بیمه شخص ثالث</Link></li>
              <li><Link to="/insurance-plans">بیمه بدنه</Link></li>
              <li><Link to="/insurance-plans">بیمه آتش‌سوزی</Link></li>
              <li><Link to="/insurance-plans">بیمه درمان</Link></li>
              <li><Link to="/quote">دریافت قیمت</Link></li>
            </FooterLinks>
          </FooterSection>
        </FooterGrid>

        <FooterBottom>
          <p>© ۱۴۰۳ بیمه امیری. تمام حقوق محفوظ است.</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            طراحی و توسعه: تیم فنی بیمه امیری | نسخه ۱.۰.۰
          </p>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;