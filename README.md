# Medicare Dashboard

A modern, edge-first fullstack web application built with Next.js 15, Cloudflare Workers, Turso, and Cloudflare R2.

## 🛠️ Tech Stack

- **Next.js 15 (App Router)**: Leveraging React Server Components, streaming, and edge support
- **Cloudflare Workers (Edge API)**: Ultra-low-latency API responses at the edge
- **Turso (Edge SQLite Database)**: Distributed SQLite database for globally consistent data access
- **Drizzle ORM**: Type-safe database queries with Turso integration
- **Cloudflare R2 (Object Storage)**: S3-compatible object storage with zero egress fees
- **Tailwind CSS**: Utility-first CSS framework for responsive UI
- **TypeScript**: Full-stack type safety

## ✨ Key Features

- ⚡ Edge API performance using Cloudflare Workers
- 🔐 Authentication & sessions at the edge
- 💾 Type-safe database queries using Drizzle ORM + Turso
- 📁 Upload and serve files using R2 with signed URLs
- 🎨 Responsive UI built with Tailwind CSS and custom components
- 🌎 Globally distributed for real-time performance
- 🚀 Server-side rendering with SEO best practices
- 🌘 Dark mode support with smooth transitions
- 🧱 Modular structure for scalable and maintainable codebase

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Turso CLI (for local development)
- Wrangler CLI (for Cloudflare Workers development)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/medicare-dashboard.git
   cd medicare-dashboard
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the environment variables file and fill in your values:

   ```bash
   cp .env.example .env.local
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Setup

You'll need to set up:

- A Turso database
- Cloudflare Workers account
- Cloudflare R2 bucket

See the `.env.example` file for required variables.

## 📁 Project Structure

```
/
├── src/                      # Source directory
│   ├── app/                  # Next.js App Router pages
│   │   └── page.tsx          # Main page component
│   ├── components/           # React components
│   │   └── ui/               # UI components
│   ├── db/                   # Database configuration
│   │   ├── schema/           # Drizzle schema definitions
│   │   └── migrations/       # Database migrations
│   ├── worker/               # Cloudflare Worker code
│   │   └── routes/           # API route handlers
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
├── wrangler.toml             # Cloudflare Workers configuration
└── drizzle.config.ts         # Drizzle ORM configuration
```

## 🔄 Database Migrations

Generate and apply database migrations:

```bash
# Generate migration
npm run db:generate

# Apply migration
npm run db:migrate
```

## 🚢 Deployment

### Next.js Application

Deploy to Vercel:

```bash
npm run build
vercel deploy --prod
```

### Cloudflare Workers

Deploy to Cloudflare:

```bash
npm run deploy:worker
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Turso](https://turso.tech/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com/)
