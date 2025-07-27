import { createGlobalStyle } from 'styled-components';
import { Theme } from './theme';

const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
  /* Import Persian fonts */
  @import url('https://fonts.googleapis.com/css2?family=Vazir:wght@300;400;500;600;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    direction: rtl; /* Right-to-left for Persian */
  }

  body {
    font-family: ${({ theme }) => theme.fonts.primary};
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.dark};
    background-color: ${({ theme }) => theme.colors.white};
    direction: rtl;
    text-align: right;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Persian number styling */
  .persian-numbers {
    font-feature-settings: "tnum" 1;
  }

  /* RTL layout adjustments */
  .ltr {
    direction: ltr;
    text-align: left;
  }

  .rtl {
    direction: rtl;
    text-align: right;
  }

  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    line-height: 1.3;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
  }

  h2 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.5rem;
  }

  h4 {
    font-size: 1.25rem;
  }

  h5 {
    font-size: 1.125rem;
  }

  h6 {
    font-size: 1rem;
  }

  /* Paragraphs and text */
  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    line-height: 1.7;
  }

  /* Links */
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
      text-decoration: underline;
    }
  }

  /* Lists */
  ul, ol {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    padding-right: ${({ theme }) => theme.spacing.lg}; /* Right padding for RTL */
  }

  li {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  /* Form elements */
  input, textarea, select, button {
    font-family: inherit;
    font-size: inherit;
    direction: rtl;
  }

  input, textarea, select {
    text-align: right;
  }

  /* Button base styles */
  button {
    cursor: pointer;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    font-weight: 500;
    transition: all 0.3s ease;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  /* Container */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.md};

    @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
      padding: 0 ${({ theme }) => theme.spacing.lg};
    }
  }

  /* Flexbox utilities */
  .flex {
    display: flex;
  }

  .flex-column {
    flex-direction: column;
  }

  .flex-center {
    justify-content: center;
    align-items: center;
  }

  .flex-between {
    justify-content: space-between;
    align-items: center;
  }

  .flex-wrap {
    flex-wrap: wrap;
  }

  /* Spacing utilities */
  .mt-1 { margin-top: ${({ theme }) => theme.spacing.sm}; }
  .mt-2 { margin-top: ${({ theme }) => theme.spacing.md}; }
  .mt-3 { margin-top: ${({ theme }) => theme.spacing.lg}; }
  .mt-4 { margin-top: ${({ theme }) => theme.spacing.xl}; }

  .mb-1 { margin-bottom: ${({ theme }) => theme.spacing.sm}; }
  .mb-2 { margin-bottom: ${({ theme }) => theme.spacing.md}; }
  .mb-3 { margin-bottom: ${({ theme }) => theme.spacing.lg}; }
  .mb-4 { margin-bottom: ${({ theme }) => theme.spacing.xl}; }

  .mr-1 { margin-right: ${({ theme }) => theme.spacing.sm}; }
  .mr-2 { margin-right: ${({ theme }) => theme.spacing.md}; }
  .mr-3 { margin-right: ${({ theme }) => theme.spacing.lg}; }

  .ml-1 { margin-left: ${({ theme }) => theme.spacing.sm}; }
  .ml-2 { margin-left: ${({ theme }) => theme.spacing.md}; }
  .ml-3 { margin-left: ${({ theme }) => theme.spacing.lg}; }

  /* Text utilities */
  .text-center { text-align: center; }
  .text-left { text-align: left; }
  .text-right { text-align: right; }

  .text-primary { color: ${({ theme }) => theme.colors.primary}; }
  .text-secondary { color: ${({ theme }) => theme.colors.secondary}; }
  .text-dark { color: ${({ theme }) => theme.colors.dark}; }
  .text-success { color: ${({ theme }) => theme.colors.success}; }
  .text-error { color: ${({ theme }) => theme.colors.error}; }
  .text-warning { color: ${({ theme }) => theme.colors.warning}; }

  /* Responsive utilities */
  .hide-mobile {
    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      display: none;
    }
  }

  .hide-desktop {
    @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
      display: none;
    }
  }

  /* Loading animation */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .loading {
    animation: spin 1s linear infinite;
  }

  /* Card styles */
  .card {
    background: ${({ theme }) => theme.colors.white};
    border-radius: ${({ theme }) => theme.borderRadius.large};
    box-shadow: ${({ theme }) => theme.shadows.medium};
    padding: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }

  /* Form validation styles */
  .form-error {
    color: ${({ theme }) => theme.colors.error};
    font-size: 0.875rem;
    margin-top: ${({ theme }) => theme.spacing.xs};
  }

  .form-success {
    color: ${({ theme }) => theme.colors.success};
    font-size: 0.875rem;
    margin-top: ${({ theme }) => theme.spacing.xs};
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.lightGray};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.mediumGray};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.primary};
  }
`;

export default GlobalStyle;