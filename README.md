# DigiMail 📧

A modern email management application built with Next.js that integrates with Gmail API and AI-powered features using Google's Gemini AI. DigiMail allows users to securely access their Gmail inbox, view emails, and leverage AI capabilities for email analysis and management.

## ✨ Features

- **Gmail Integration**: Secure OAuth authentication with Gmail
- **Email Viewing**: Browse and read emails from your Gmail account
- **AI-Powered Analysis**: Email analysis and insights using Google Gemini AI
- **PDF Export**: Generate PDF reports of email data
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui components
- **Real-time Updates**: React Query for efficient data fetching and caching
- **Secure Authentication**: NextAuth.js with Google OAuth provider

## 🚀 Technology Stack

- **Framework**: Next.js 15.4.4 with App Router
- **React**: 19.1.0 with React Hooks
- **Authentication**: NextAuth.js with Google OAuth
- **Styling**: Tailwind CSS with shadcn/ui components
- **AI Integration**: Google Generative AI (Gemini)
- **Data Fetching**: TanStack React Query
- **PDF Generation**: jsPDF with AutoTable
- **Icons**: Lucide React & Font Awesome
- **Animations**: Lottie animations
- **Form Handling**: React Hook Form

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18.0 or higher
- npm, yarn, pnpm, or bun package manager
- Google Cloud Console project with Gmail API enabled
- Google API credentials (OAuth 2.0)
- Gemini API key

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/khanmuhammadrayyan17/digimail.git
   cd digimail
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory and add the following variables:
   ```env
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret

   # Google OAuth Credentials
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # Gemini AI API Key
   GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Configure Google Cloud Console**
   - Enable Gmail API in your Google Cloud project
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

## 🏃‍♂️ Running the Application

1. **Development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

3. **Build for production**
   ```bash
   npm run build
   npm run start
   ```

## 📁 Project Structure

```
digimail/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/     # NextAuth configuration
│   │   │   ├── emails/                # Gmail API integration
│   │   │   └── gemini/                # Gemini AI integration
│   │   ├── signin/                    # Authentication pages
│   │   ├── layout.js                  # Root layout
│   │   ├── page.js                    # Home page
│   │   └── globals.css                # Global styles
│   ├── components/
│   │   └── ui/                        # shadcn/ui components
│   └── lib/
│       └── utils.js                   # Utility functions
├── public/                            # Static assets and Lottie animations
├── package.json                       # Project dependencies
├── tailwind.config.js                 # Tailwind CSS configuration
└── next.config.mjs                    # Next.js configuration
```

## 🔧 API Endpoints

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js authentication handlers

### Email Management
- `GET /api/emails` - Fetch emails from Gmail
  - Query parameters: `maxResults`, `pageToken`, `q` (search query)
- `GET /api/emails/[id]` - Fetch specific email details

### AI Integration
- `POST /api/gemini` - Generate AI responses using Gemini
  - Body: `{ "prompt": "your prompt here" }`

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXTAUTH_URL` | Your app's URL (http://localhost:3000 for development) | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js session encryption | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `GEMINI_API_KEY` | Google Gemini AI API key | Yes |

## 🎯 Usage

1. **Sign In**: Use the Google OAuth sign-in to authenticate with your Gmail account
2. **View Emails**: Browse your recent emails in a clean, modern interface
3. **AI Analysis**: Use AI features to analyze email content and get insights
4. **Export Data**: Generate PDF reports of your email data
5. **Secure Access**: All data is processed securely with proper authentication

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed on any platform that supports Next.js applications. Make sure to:
- Set all required environment variables
- Configure OAuth redirect URIs for your production domain
- Ensure Gmail API quotas are sufficient for your usage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Known Issues & Troubleshooting

- **Authentication Errors**: If you encounter Gmail access issues, sign out and sign in again to refresh tokens
- **API Quotas**: Be mindful of Gmail API and Gemini API rate limits
- **Environment Variables**: Ensure all required environment variables are properly set

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Authentication powered by [NextAuth.js](https://next-auth.js.org)
- AI capabilities by [Google Gemini](https://ai.google.dev)
