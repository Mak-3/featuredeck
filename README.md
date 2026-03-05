# FeatureDeck

A feedback management application built with Next.js (full-stack).

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase (public - safe for browser)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Supabase (server-only - never expose to browser)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Start the Development Server

```bash
npm run dev
```

The application will run on `http://localhost:3000`

**Note:** All API routes are now integrated into Next.js, so you only need to run one server.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
featureDeck/
├── src/
│   ├── app/
│   │   ├── api/       # Next.js API routes (serverless functions)
│   │   │   ├── feedback/    # Feedback endpoints
│   │   │   ├── projects/    # Project endpoints
│   │   │   ├── api-keys/    # API key endpoints
│   │   │   └── health/      # Health check
│   │   └── ...        # Next.js pages
│   ├── components/    # React components
│   └── lib/           # Utility libraries
│       ├── supabase.ts        # Client-side Supabase
│       ├── supabase-server.ts # Server-side Supabase
│       └── api-helpers.ts     # Auth & error handling
└── package.json
```

## API Endpoints

All API endpoints are available at `/api/*`:

### Health
- `GET /api/health` - Health check

### API Keys
- `GET /api/api-keys` - Get masked API key
- `GET /api/api-keys/show` - Get full API key
- `POST /api/api-keys/regenerate` - Regenerate API key

### Feedback
- `GET /api/feedback` - List all feedback
- `GET /api/feedback/:id` - Get feedback by ID
- `POST /api/feedback` - Create feedback
- `PATCH /api/feedback/:id` - Update feedback (auth required)
- `DELETE /api/feedback/:id` - Delete feedback (auth required)
- `POST /api/feedback/:id/vote` - Vote on feedback

### Projects
- `GET /api/projects` - List user's projects (auth required)
- `GET /api/projects/:id` - Get project by ID (auth required)
- `POST /api/projects` - Create project (auth required)
- `PATCH /api/projects/:id` - Update project (auth required)
- `DELETE /api/projects/:id` - Delete project (auth required)

## Authentication

The API uses Supabase authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Deployment

This application is ready to deploy on Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy - all API routes work as serverless functions

No separate backend deployment needed!

## Troubleshooting

1. **Port already in use**: Make sure port 3000 is available
2. **Supabase connection errors**: Verify your environment variables are correct
3. **API errors**: Check that `SUPABASE_SERVICE_ROLE_KEY` is set for admin operations

## Migration Notes

If you're migrating from the old Express backend structure, see `MIGRATION_NOTES.md` for details.

