import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics tracking ID - replace with your actual GA4 measurement ID
const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID || 'G-XXXXXXXXXX';

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID && GA_TRACKING_ID !== 'G-XXXXXXXXXX') {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track page views
export const trackPageView = (path, title) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID !== 'G-XXXXXXXXXX') {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: path,
      page_title: title,
    });
  }
};

// Track custom events
export const trackEvent = (action, category = 'General', label = '', value = 0) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID !== 'G-XXXXXXXXXX') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track business events
export const trackBusinessEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID !== 'G-XXXXXXXXXX') {
    window.gtag('event', eventName, {
      event_category: 'Business',
      ...parameters
    });
  }
};

// Google Analytics component for automatic page tracking
export default function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Initialize GA on component mount
    initGA();
  }, []);

  useEffect(() => {
    // Track page views on route changes
    const path = location.pathname + location.search;
    const title = document.title;
    trackPageView(path, title);
  }, [location]);

  return null; // This component doesn't render anything
}

// Custom hook for tracking business actions
export const useBusinessTracking = () => {
  const trackExpenseAdded = (amount, category) => {
    trackBusinessEvent('expense_added', {
      currency: 'USD',
      value: amount,
      expense_category: category
    });
  };

  const trackIncomeAdded = (amount, source) => {
    trackBusinessEvent('income_added', {
      currency: 'USD',
      value: amount,
      income_source: source
    });
  };

  const trackReportGenerated = (reportType) => {
    trackBusinessEvent('report_generated', {
      report_type: reportType
    });
  };

  const trackOCRProcessed = (documentType, confidence) => {
    trackBusinessEvent('ocr_processed', {
      document_type: documentType,
      confidence_score: confidence
    });
  };

  const trackTaxExport = (taxYear, exportType) => {
    trackBusinessEvent('tax_export', {
      tax_year: taxYear,
      export_type: exportType
    });
  };

  const trackSubscriptionUpgrade = (fromTier, toTier) => {
    trackBusinessEvent('subscription_upgrade', {
      from_tier: fromTier,
      to_tier: toTier
    });
  };

  return {
    trackExpenseAdded,
    trackIncomeAdded,
    trackReportGenerated,
    trackOCRProcessed,
    trackTaxExport,
    trackSubscriptionUpgrade
  };
};

