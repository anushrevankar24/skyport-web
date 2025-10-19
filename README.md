# SkyPort Web

Modern web interface for SkyPort tunnel management built with Next.js 15, React 19, and TypeScript.

## Features

- 🔐 User authentication with JWT
- 🚇 Tunnel management dashboard
- 🔄 Real-time tunnel status
- 📱 Responsive design with Tailwind CSS
- 🚀 Agent authentication flow

## Prerequisites

- Node.js 18+ 
- npm or yarn
- SkyPort Server running (for API backend)

## Getting Started

### 1. Clone and Install

```bash
cd skyport-web
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your API endpoint:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
```

For local development, use:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### 3. Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build

Build and run the production version:

```bash
npm run build
npm start
```

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables:
   - `NEXT_PUBLIC_API_URL`: Your SkyPort Server API URL
4. Deploy!

Vercel will automatically detect the Next.js configuration and deploy your app.

### Manual Deployment

For other platforms:

```bash
npm run build
npm start
```

The production server will start on port 3000 by default.

## Project Structure

```
skyport-web/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── login/        # Login page
│   │   ├── signup/       # Signup page
│   │   ├── dashboard/    # Main dashboard
│   │   └── agent-auth/   # Agent authentication
│   ├── contexts/         # React contexts
│   │   └── AuthContext.tsx
│   └── lib/              # Utilities and API
│       └── api.ts        # API client
├── public/               # Static assets
└── package.json
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | SkyPort Server API endpoint | Yes | `http://localhost:8080/api/v1` |

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **State**: React Context API

## License

MIT
