# Ledgerly Frontend

**Modern React application for business finance management with OCR processing, real-time analytics, and professional reporting.**

## 🚀 Overview

The Ledgerly Frontend is a sophisticated React application built with Vite, providing an intuitive and powerful interface for business finance management. It features automated OCR receipt processing, comprehensive financial reporting, and a modern design system optimized for both desktop and mobile use.

## 🏗️ Technology Stack

- **Framework**: React 19.1.0
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **State Management**: React Context + Hooks
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **SEO**: React Helmet Async
- **Analytics**: Google Analytics 4

## 📁 Project Structure

```
ledgerly-frontend/
├── public/
│   ├── index.html          # Main HTML template
│   ├── favicon.ico         # App favicon
│   ├── robots.txt          # SEO robots file
│   └── site.webmanifest    # PWA manifest
├── src/
│   ├── components/         # Reusable components
│   │   ├── auth/          # Authentication components
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── pages/         # Main application pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Expenses.jsx
│   │   │   ├── Income.jsx
│   │   │   ├── Vendors.jsx
│   │   │   ├── Documents.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── TaxTidy.jsx
│   │   │   └── Settings.jsx
│   │   ├── ui/            # shadcn/ui components
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── input.jsx
│   │   │   └── ...
│   │   ├── Layout.jsx     # Main layout component
│   │   ├── SEOHead.jsx    # SEO meta management
│   │   ├── GoogleAnalytics.jsx
│   │   └── OCRUpload.jsx  # OCR file upload
│   ├── hooks/             # Custom React hooks
│   │   └── useAuth.jsx    # Authentication hook
│   ├── lib/               # Utility functions
│   │   └── utils.js       # Helper utilities
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── vite.config.js         # Vite configuration
├── postcss.config.js      # PostCSS configuration
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- pnpm, npm, or yarn package manager
- Supabase account and project
- Backend API running (see ledgerly-backend)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd ledgerly-frontend
```

2. **Install dependencies:**
```bash
pnpm install
# or
npm install
```

3. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the development server:**
```bash
pnpm dev
# or
npm run dev
```

5. **Build for production:**
```bash
pnpm build
# or
npm run build
```

## ⚙️ Environment Configuration

Create a `.env` file with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
VITE_API_URL=http://localhost:3001

# Analytics (optional)
REACT_APP_GA_TRACKING_ID=G-XXXXXXXXXX

# App Configuration
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development
```

## 🎨 Features

### Authentication System
- **User Registration**: Secure account creation with email verification
- **Login/Logout**: JWT-based authentication with session management
- **Profile Management**: User profile updates and preferences
- **Password Reset**: Secure password recovery workflow

### Financial Management
- **Dashboard**: Real-time financial overview with key metrics
- **Expense Tracking**: Comprehensive expense entry and categorization
- **Income Management**: Income source tracking and reporting
- **Vendor Management**: Business relationship and spending analysis

### OCR Processing
- **Receipt Upload**: Drag-and-drop interface for receipt processing
- **Data Extraction**: Automatic vendor, amount, and date detection
- **Confidence Scoring**: Visual indicators for extraction accuracy
- **Manual Review**: Easy correction of extracted data

### Financial Reporting
- **Profit & Loss**: Professional P&L statements with visualizations
- **Expense Analytics**: Category breakdowns and trend analysis
- **Vendor Reports**: Spending patterns and relationship insights
- **Custom Reports**: Flexible date ranges and filtering options

### TaxTidy Module
- **Tax Summaries**: Annual and quarterly tax calculations
- **Deduction Tracking**: Automated categorization of deductible expenses
- **Export Functionality**: Multi-format tax data export
- **Compliance Tools**: IRS-compliant reporting and documentation

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark/Light Mode**: Theme switching for user preference
- **Accessibility**: WCAG 2.1 AA compliant interface
- **Progressive Web App**: Offline capabilities and app-like experience

## 🎨 Design System

### Component Library
Built on shadcn/ui with custom Tailwind CSS configuration:

- **Colors**: Professional color palette with semantic naming
- **Typography**: Consistent font hierarchy and spacing
- **Components**: Reusable UI components with variants
- **Icons**: Lucide React icon library integration
- **Animations**: Smooth transitions and micro-interactions

### Responsive Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

## 🔌 API Integration

### Authentication
- Supabase Auth integration for user management
- JWT token handling and refresh
- Automatic session management
- Role-based access control

### Data Management
- RESTful API communication with backend
- Real-time data updates
- Optimistic UI updates
- Error handling and retry logic

### File Upload
- Secure file upload to backend
- Progress tracking and status updates
- File type validation and size limits
- OCR processing status monitoring

## 📊 Analytics & SEO

### Google Analytics 4
- Page view tracking
- User interaction events
- Custom business metrics
- Conversion funnel analysis

### SEO Optimization
- Dynamic meta tags with React Helmet
- OpenGraph and Twitter Card support
- Structured data (JSON-LD)
- Sitemap generation
- Canonical URLs

### Performance
- Code splitting and lazy loading
- Image optimization
- Bundle size optimization
- Service worker caching

## 🚀 Deployment

### Vercel Deployment

1. **Connect your repository to Vercel**
2. **Configure build settings:**
   - Framework Preset: Vite
   - Build Command: `pnpm build`
   - Output Directory: `dist`
3. **Set environment variables**
4. **Deploy and monitor**

### Netlify Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
pnpm build
netlify deploy --prod --dir=dist
```

### Self-Hosted Deployment

```bash
# Build the application
pnpm build

# Serve with a static server
npx serve -s dist -l 3000
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e
```

### Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API integration and user flows
- **E2E Tests**: Complete user journey testing
- **Visual Tests**: Component visual regression testing

## 🔧 Development

### Available Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm test         # Run test suite
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
```

### Code Standards
- ESLint configuration for React
- Prettier for code formatting
- Conventional commits for git messages
- Component documentation with JSDoc

### Development Workflow
1. Create feature branch
2. Implement changes with tests
3. Run linting and formatting
4. Commit with conventional commits
5. Create pull request

## 🔒 Security

### Data Protection
- Environment variable security
- XSS protection with React
- CSRF protection
- Secure API communication

### Authentication Security
- JWT token secure storage
- Automatic token refresh
- Session timeout handling
- Secure logout functionality

## 📱 Progressive Web App

### PWA Features
- App manifest configuration
- Service worker for offline functionality
- App-like installation experience
- Push notification support (future)

### Offline Capabilities
- Cached static assets
- Offline page fallback
- Background sync (future)
- Local data persistence

## 🎯 Performance Optimization

### Bundle Optimization
- Tree shaking for unused code
- Code splitting by routes
- Dynamic imports for large components
- Vendor chunk optimization

### Runtime Performance
- React.memo for component optimization
- useMemo and useCallback for expensive operations
- Virtual scrolling for large lists
- Image lazy loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [Component Documentation](src/components/README.md)
- [API Integration Guide](docs/api-integration.md)
- [Deployment Guide](../DEPLOYMENT_GUIDE.md)

### Contact
- **Company**: Visnec Global
- **Email**: info@visnec.com
- **GitHub Issues**: For bug reports and feature requests

## 🔄 Changelog

### Version 1.0.0
- Initial release with core functionality
- Authentication system implementation
- Financial management features
- OCR processing integration
- Responsive design system
- SEO optimization
- PWA capabilities

---

**Built with ❤️ by Visnec Global**

*Empowering businesses with intelligent financial management tools.*

