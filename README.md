# AMIN TOUCH Staff Management System

একটি আধুনিক এবং সম্পূর্ণ staff management এবং income tracking system যা AMIN TOUCH trading, contracting এবং hospitality services এর জন্য তৈরি।

## Features

### 📊 Admin Dashboard
- সকল staff এর income এবং OTP tracking
- Monthly এবং yearly reports
- PDF invoice generation
- Staff-wise filtering এবং analysis
- Real-time statistics

### 👤 Staff Dashboard
- নিজের income এবং OTP entries view করা
- Ticket sales management
- Personal performance tracking
- PDF invoice download

### 🔐 Authentication
- Manus OAuth integration
- Role-based access control (Admin/Staff)
- Secure session management

### 📈 Features
- Income tracking (Daily income, OTP payments)
- Ticket management (Flight bookings, PNR tracking)
- Advanced filtering (By staff, month, year)
- Professional PDF invoice generation
- Search and highlight functionality

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4
- **Backend**: Express.js, tRPC
- **Database**: MySQL/TiDB with Drizzle ORM
- **Authentication**: Manus OAuth
- **PDF Generation**: jsPDF
- **Styling**: Tailwind CSS with custom theming

## Project Structure

```
client/
  ├── src/
  │   ├── pages/           # Page components
  │   ├── components/      # Reusable UI components
  │   ├── lib/             # Utilities and helpers
  │   └── App.tsx          # Main app component
  └── public/              # Static assets

server/
  ├── routers.ts           # tRPC procedures
  ├── db.ts                # Database queries
  └── _core/               # Framework configuration

drizzle/
  └── schema.ts            # Database schema

shared/
  └── const.ts             # Shared constants
```

## Installation

### Prerequisites
- Node.js 18+
- pnpm or npm
- MySQL database

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/mdronytalukder42/amin-touch-staff-managment-last-project.git
cd amin-touch-staff-managment-last-project
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Setup environment variables**
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

4. **Setup database**
```bash
pnpm db:push
```

5. **Seed initial data (optional)**
```bash
node seed-users.mjs
```

6. **Start development server**
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## Environment Variables

Required environment variables:

```
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your_jwt_secret
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=your_owner_id
OWNER_NAME=Your Name
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_api_key
VITE_APP_TITLE=AMIN TOUCH Staff Management
VITE_APP_LOGO=/logo.png
```

## Database Schema

### Users Table
- `id`: Primary key
- `openId`: Manus OAuth identifier
- `name`: User name
- `email`: Email address
- `role`: admin or user
- `createdAt`: Account creation date
- `lastSignedIn`: Last login date

### Income Entries
- `id`: Primary key
- `staffId`: Reference to user
- `date`: Entry date
- `type`: OTP Add/Minus or Income
- `amount`: Amount in QR
- `description`: Entry description

### Ticket Entries
- `id`: Primary key
- `staffId`: Reference to user
- `date`: Booking date
- `passengerName`: Passenger name
- `pnr`: Booking reference
- `flightName`: Flight number
- `from`: Departure city
- `to`: Arrival city

## API Endpoints

All API calls go through `/api/trpc`:

### Authentication
- `auth.me` - Get current user
- `auth.logout` - Logout user

### Income Management
- `income.list` - Get income entries
- `income.create` - Create new entry
- `income.update` - Update entry
- `income.delete` - Delete entry

### Ticket Management
- `tickets.list` - Get ticket entries
- `tickets.create` - Create new ticket
- `tickets.update` - Update ticket
- `tickets.delete` - Delete ticket

## Development

### Code Style
- ESLint configuration included
- Prettier for code formatting
- TypeScript for type safety

### Testing
Run tests with:
```bash
pnpm test
```

### Build for Production
```bash
pnpm build
```

## Deployment

### Railway Deployment
See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed instructions.

Quick steps:
1. Push code to GitHub (already done)
2. Connect Railway to GitHub repo
3. Set environment variables
4. Deploy

### Docker Deployment
```bash
docker build -t amin-touch-staff-management .
docker run -p 3000:3000 amin-touch-staff-management
```

## Features Roadmap

- [ ] Email notifications for admin
- [ ] Monthly summary reports
- [ ] Data export (Excel/CSV)
- [ ] Advanced analytics dashboard
- [ ] Staff performance metrics
- [ ] Automated backup system
- [ ] Mobile app version

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

All rights reserved © 2025 AMIN TOUCH

## Support

For issues and questions:
- Check existing GitHub issues
- Create a new issue with detailed description
- Include error logs and screenshots

## Credits

Built with ❤️ for AMIN TOUCH Trading, Contracting & Hospitality Services

---

**Last Updated**: November 2025
**Version**: 1.0.0
