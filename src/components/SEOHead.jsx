import { Helmet } from 'react-helmet-async';

export default function SEOHead({ 
  title = 'Ledgerly - Business Finance Suite',
  description = 'Professional business finance management with automated expense tracking, OCR receipt processing, and comprehensive tax preparation tools.',
  keywords = 'business finance, expense tracking, receipt OCR, tax preparation, accounting software, financial reports, business expenses',
  image = '/og-image.jpg',
  url = 'https://ledgerly.com',
  type = 'website'
}) {
  const fullTitle = title.includes('Ledgerly') ? title : `${title} | Ledgerly`;
  const fullUrl = url.startsWith('http') ? url : `https://ledgerly.com${url}`;
  const fullImage = image.startsWith('http') ? image : `https://ledgerly.com${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Ledgerly Team" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#2563eb" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Ledgerly" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:creator" content="@ledgerly" />
      <meta name="twitter:site" content="@ledgerly" />
      
      {/* Additional Meta Tags */}
      <meta name="application-name" content="Ledgerly" />
      <meta name="apple-mobile-web-app-title" content="Ledgerly" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Ledgerly",
          "description": description,
          "url": "https://ledgerly.com",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "creator": {
            "@type": "Organization",
            "name": "Ledgerly Team"
          },
          "featureList": [
            "Expense Tracking",
            "Receipt OCR Processing",
            "Financial Reports",
            "Tax Preparation",
            "Vendor Management",
            "Document Vault"
          ]
        })}
      </script>
    </Helmet>
  );
}

