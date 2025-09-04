# Overview

Trend Gazer is a modern YouTube trending video explorer built with Next.js 15 and React 18. The application provides a comprehensive platform for discovering trending YouTube videos worldwide, featuring AI-powered video summaries, real-time analytics, and a responsive design. Users can explore trending content across different regions and categories, with intelligent filtering and sorting capabilities powered by Google's Gemini AI model.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application follows a modern React architecture with Next.js App Router, implementing a component-based design pattern with shadcn/ui components for consistent styling. The frontend uses TypeScript for type safety and Tailwind CSS for utility-first styling with custom CSS variables for theming support.

**Key Design Decisions:**
- **Component Structure**: Modular component architecture with dedicated folders for UI components and feature-specific components (trend-gazer)
- **State Management**: React hooks (useState, useEffect) for local state management with client-side routing using Next.js navigation
- **Styling System**: Tailwind CSS with custom design tokens and dark/light theme support via next-themes
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts

## Backend Architecture
Server-side functionality is implemented using Next.js API routes with server components for data fetching. The application leverages React Server Components for improved performance and SEO.

**Key Design Decisions:**
- **Server Components**: Utilizes React Server Components for data fetching and rendering
- **API Integration**: Direct integration with YouTube Data API v3 for fetching trending videos
- **Caching Strategy**: Implements Next.js caching with revalidation (1-hour cache) for API responses
- **Error Handling**: Comprehensive error handling for API failures and network issues

## Data Management
The application uses a type-safe approach to data handling with TypeScript interfaces and utility functions for data transformation.

**Key Design Decisions:**
- **Type Safety**: Comprehensive TypeScript types for YouTube API responses and internal data structures
- **Data Transformation**: Utility functions for formatting views, dates, and calculating trending scores
- **Client-side Filtering**: Advanced filtering and sorting capabilities implemented on the client side

## AI Integration
Integrates Google's Gemini AI model through the Genkit framework for generating video summaries and insights.

**Key Design Decisions:**
- **AI Framework**: Uses Google Genkit with Gemini 2.0 Flash model for AI functionality
- **Batch Processing**: Processes multiple videos simultaneously for efficient AI summary generation
- **Graceful Degradation**: Application continues to function even if AI services are unavailable
- **Server Actions**: AI processing is handled via Next.js server actions for security and performance

## Authentication & Security
The application implements security best practices with API key management and CORS configuration.

**Key Design Decisions:**
- **API Security**: YouTube API key is securely managed via environment variables
- **CORS Configuration**: Proper CORS headers configured for Replit compatibility
- **Content Security**: Frame options and security headers implemented

# External Dependencies

## Core Framework & Runtime
- **Next.js 15.3.3**: React framework providing App Router, server components, and build optimization
- **React 18.3.1**: Component library for building the user interface
- **TypeScript**: Type safety and enhanced development experience

## UI & Styling
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Radix UI**: Headless UI components (@radix-ui/*) for accessibility and functionality
- **Lucide React**: Icon library for consistent iconography
- **Framer Motion**: Animation library for enhanced user interactions
- **next-themes**: Theme management for dark/light mode support

## AI & Data Processing
- **Google Genkit**: AI framework for integrating Google's AI models
- **Google AI (@genkit-ai/googleai)**: Integration with Google's Gemini AI model
- **Zod (via genkit)**: Schema validation for AI inputs and outputs

## External APIs
- **YouTube Data API v3**: Primary data source for trending videos
  - Endpoint: `https://www.googleapis.com/youtube/v3/`
  - Features: Video metadata, statistics, thumbnails, regional trending data
  - Rate limiting and caching implemented

## Development & Utilities
- **date-fns**: Date formatting and manipulation utilities
- **clsx & class-variance-authority**: Utility for conditional CSS classes
- **dotenv**: Environment variable management
- **patch-package**: Package modification utilities

## Form & State Management
- **React Hook Form**: Form state management and validation
- **@hookform/resolvers**: Form validation resolvers

## Image & Media Handling
- **Next.js Image Optimization**: Built-in image optimization with remote pattern support
- **YouTube Embed API**: Embedded video player functionality

The application is configured for deployment on Replit with specific proxy compatibility settings and development server configuration optimized for the Replit environment.