# ArtDesk - Internal Support Portal

A comprehensive internal support and sales management platform designed specifically for art galleries, dealers, and art sales organizations.

## Overview

ArtDesk streamlines internal operations for art businesses by providing:

- **Ticket Management System** - Handle support requests with art-specific categories
- **Leads & Client Management** - Track prospects and manage client relationships
- **Analytics Dashboard** - Monitor performance metrics and team productivity
- **Professional Gallery Aesthetic** - Clean, modern interface that reflects the art world

## Features

### 🎫 Ticket Management
- Art-specific categories: Authentication, Exhibition, Sales, Restoration, Insurance
- Priority levels and status tracking
- Team member assignment
- Real-time updates and notifications

### 👥 Sales Management
- Lead capture and qualification
- Client relationship management
- Art interest tracking and budget management
- Sales pipeline analytics

### 📊 Analytics & Reporting
- Real-time dashboard metrics
- Visual charts and performance indicators
- Team productivity tracking
- Sales funnel insights

## Target Users

- Gallery staff and coordinators
- Art dealers and sales teams
- Exhibition coordinators
- Operations and support teams

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router
- **State Management**: TanStack Query
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd artdesk

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── LeadForm.tsx    # Lead capture form
│   ├── LeadsList.tsx   # Lead management table
│   ├── ClientsList.tsx # Client management
│   ├── TicketForm.tsx  # Support ticket creation
│   ├── TicketList.tsx  # Ticket management
│   └── StatsCards.tsx  # Dashboard metrics
├── pages/              # Main application pages
│   ├── Index.tsx       # Dashboard homepage
│   ├── Leads.tsx       # Sales management page
│   └── NotFound.tsx    # 404 page
├── types/              # TypeScript type definitions
│   ├── sales.ts        # Lead/Client types
│   └── ticket.ts       # Ticket types
└── lib/                # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is proprietary software designed for internal use by art organizations.

## Support

For technical support or feature requests, please create a ticket through the internal support system or contact the development team.