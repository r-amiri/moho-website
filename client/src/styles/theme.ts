export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    dark: string;
    white: string;
    lightGray: string;
    mediumGray: string;
    success: string;
    error: string;
    warning: string;
    info: string;
  };
  fonts: {
    primary: string;
    fallback: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
    round: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
    wide: string;
  };
}

const theme: Theme = {
  colors: {
    primary: '#87cfd1',      // Your specified teal
    secondary: '#9093de',    // Your specified purple
    dark: '#14142f',         // Your specified dark navy
    white: '#ffffff',        // Your specified white
    lightGray: '#f8f9fa',
    mediumGray: '#6c757d',
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8'
  },
  fonts: {
    primary: 'Digi Hamishe, Vazir, Tahoma, Arial, sans-serif',
    fallback: 'Tahoma, Arial, sans-serif'
  },
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    xxl: '3rem'       // 48px
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    round: '50%'
  },
  shadows: {
    small: '0 1px 3px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
    large: '0 10px 25px rgba(0, 0, 0, 0.15)'
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1200px'
  }
};

export default theme;