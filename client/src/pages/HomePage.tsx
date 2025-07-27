import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  min-height: calc(100vh - 70px);
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}22, ${({ theme }) => theme.colors.secondary}22);
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.dark};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 500;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.25rem;
  }
`;

const HeroDescription = styled.p`
  font-size: 1.125rem;
  line-height: 1.8;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.dark};
`;

const CTAButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(Link)`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  display: inline-block;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }
`;

const SecondaryButton = styled(Link)`
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  display: inline-block;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    transform: translateY(-2px);
  }
`;

const InsuranceTypesSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  background: ${({ theme }) => theme.colors.lightGray};
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.dark};
`;

const InsuranceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
`;

const InsuranceCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }
`;

const CardIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${({ theme }) => theme.colors.primary}22;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.lg} auto;
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const CardTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.dark};
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.colors.mediumGray};
  line-height: 1.6;
`;

const ProcessSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xxl} 0;
`;

const ProcessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const ProcessStep = styled.div`
  text-align: center;
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.lg} auto;
  font-size: 1.5rem;
  font-weight: 700;
`;

const StepTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StepDescription = styled.p`
  color: ${({ theme }) => theme.colors.mediumGray};
`;

const FeaturesSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  background: ${({ theme }) => theme.colors.lightGray};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.small};
  text-align: center;
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.primary};
`;

const FeatureTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.dark};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.mediumGray};
`;

const CTASection = styled.section`
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  text-align: center;
  color: ${({ theme }) => theme.colors.white};
`;

const CTATitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.white};
`;

const CTADescription = styled.p`
  font-size: 1.125rem;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButton = styled(Link)`
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  display: inline-block;

  &:hover {
    background: ${({ theme }) => theme.colors.lightGray};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }
`;

const HomePage: React.FC = () => {
  return (
    <HomeContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>بیمه امیری</HeroTitle>
          <HeroSubtitle>انتخاب و خرید آنلاین بیمه</HeroSubtitle>
          <HeroDescription>
            به آسانی خدمات بیمه‌ای را با آگاهی کامل٬ مناسب‌ترین قیمت و بهترین خدمات پس از فروش دریافت نمایید.
          </HeroDescription>
          <CTAButtons>
            <PrimaryButton to="/insurance-plans">مشاهده طرح‌های بیمه</PrimaryButton>
            <SecondaryButton to="/quote">دریافت قیمت</SecondaryButton>
          </CTAButtons>
        </HeroContent>
      </HeroSection>

      {/* Insurance Types */}
      <InsuranceTypesSection>
        <SectionContainer>
          <SectionTitle>انواع بیمه‌های ما</SectionTitle>
          <InsuranceGrid>
            <InsuranceCard>
              <CardIcon>🚗</CardIcon>
              <CardTitle>بیمه شخص ثالث</CardTitle>
              <CardDescription>
                پوشش کامل خسارات وارده به شخص ثالث در تصادفات رانندگی با بهترین شرایط
              </CardDescription>
            </InsuranceCard>
            <InsuranceCard>
              <CardIcon>🛡️</CardIcon>
              <CardTitle>بیمه بدنه</CardTitle>
              <CardDescription>
                محافظت شامل خودرو شما در برابر تصادف، سرقت، آتش‌سوزی و سایر خسارات
              </CardDescription>
            </InsuranceCard>
            <InsuranceCard>
              <CardIcon>🏠</CardIcon>
              <CardTitle>بیمه آتش‌سوزی</CardTitle>
              <CardDescription>
                پوشش خسارات آتش‌سوزی، انفجار و صاعقه برای منزل و اموال شما
              </CardDescription>
            </InsuranceCard>
            <InsuranceCard>
              <CardIcon>⚕️</CardIcon>
              <CardTitle>بیمه درمان</CardTitle>
              <CardDescription>
                پوشش هزینه‌های درمان، بستری، ویزیت و دارو با بهترین خدمات
              </CardDescription>
            </InsuranceCard>
          </InsuranceGrid>
        </SectionContainer>
      </InsuranceTypesSection>

      {/* Claims Process */}
      <ProcessSection>
        <SectionContainer>
          <SectionTitle>دریافت خسارت به صورت آنلاین</SectionTitle>
          <HeroDescription style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            خسارت خود را به راحتی در سه مرحله دریافت کنید. بدون دردسر و پرداخت هزینه اضافه٬ خسارت خود را از شرکت بیمه امیری بگیرید. واحد پشتیبانی ما در تمام مراحل در کنار شماست.
          </HeroDescription>
          <ProcessGrid>
            <ProcessStep>
              <StepNumber>۱</StepNumber>
              <StepTitle>ثبت درخواست</StepTitle>
              <StepDescription>
                درخواست خسارت خود را به صورت آنلاین ثبت کنید
              </StepDescription>
            </ProcessStep>
            <ProcessStep>
              <StepNumber>۲</StepNumber>
              <StepTitle>ارزیابی درخواست</StepTitle>
              <StepDescription>
                کارشناسان ما درخواست شما را بررسی و ارزیابی می‌کنند
              </StepDescription>
            </ProcessStep>
            <ProcessStep>
              <StepNumber>۳</StepNumber>
              <StepTitle>پرداخت آنلاین</StepTitle>
              <StepDescription>
                خسارت تأیید شده به حساب شما واریز می‌شود
              </StepDescription>
            </ProcessStep>
          </ProcessGrid>
        </SectionContainer>
      </ProcessSection>

      {/* Features */}
      <FeaturesSection>
        <SectionContainer>
          <SectionTitle>چرا بیمه امیری را انتخاب کنید؟</SectionTitle>
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>💻</FeatureIcon>
              <FeatureTitle>خرید آنلاین بیمه</FeatureTitle>
              <FeatureDescription>
                امکان خرید و مدیریت بیمه‌نامه به صورت کاملاً آنلاین
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>📋</FeatureIcon>
              <FeatureTitle>محصولات متنوع</FeatureTitle>
              <FeatureDescription>
                طیف گسترده‌ای از محصولات بیمه‌ای برای تمام نیازهای شما
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>🎯</FeatureIcon>
              <FeatureTitle>خدمات پس از فروش</FeatureTitle>
              <FeatureDescription>
                پشتیبانی و خدمات پس از فروش در تمام مراحل
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>📞</FeatureIcon>
              <FeatureTitle>پشتیبانی ۲۴ ساعته</FeatureTitle>
              <FeatureDescription>
                تیم پشتیبانی ما در تمام ساعات شبانه‌روز در خدمت شماست
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </SectionContainer>
      </FeaturesSection>

      {/* CTA Section */}
      <CTASection>
        <SectionContainer>
          <CTATitle>آماده شروع هستید؟</CTATitle>
          <CTADescription>
            همین الان بیمه‌نامه مناسب خود را انتخاب کنید و از خدمات بیمه امیری بهره‌مند شوید
          </CTADescription>
          <CTAButton to="/register">شروع کنید</CTAButton>
        </SectionContainer>
      </CTASection>
    </HomeContainer>
  );
};

export default HomePage;