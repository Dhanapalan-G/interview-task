# Sales Analysis API - Interview Task

This project is a NestJS-based API server that:
- Uploads and processes large sales data (CSV)
- Provides analysis APIs like Revenue Trends
- Supports role-based (Admin/User) authentication

## 🚀 Tech Stack

- Node.js (v18+)
- NestJS
- TypeORM + PostgreSQL (or MySQL)
- JWT Authentication
- Multer (CSV Upload)

## 📦 Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/interview-task.git

Install dependencies:
yarn install

Start the server:
yarn run start:dev
server will run at port 3000



⚙️ Prerequisites

Tool | Version
Node.js | v18+
NPM | v9+
PostgreSQL | 13+
Python | ❌ Not required

Final Notes
Only Admins can upload CSV data

Daily refresh (optional cron job) can be configured

Robust JWT security