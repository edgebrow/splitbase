# SplitBase 💰

A Base Mini App for splitting bills with friends using USDC on the Base blockchain.

![SplitBase](https://img.shields.io/badge/Base-Mini%20App-0052FF?style=for-the-badge)
![USDC](https://img.shields.io/badge/Payments-USDC-2775CA?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge)

## Features

- **📝 Create Bills** - Easily create bills with title, amount, and description
- **👥 Add Participants** - Add friends to split the bill with
- **⚖️ Smart Splitting** - Automatically calculate equal splits or customize amounts
- **✅ Track Payments** - Mark participants as paid and track progress
- **📤 Share Bills** - Share bill details with friends via native share or clipboard
- **💳 USDC Payments** - Settle up using USDC on Base (low fees!)
- **🔗 Wallet Integration** - Connect with Coinbase Wallet via OnchainKit

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Blockchain**: Base (Ethereum L2)
- **Wallet**: OnchainKit + Wagmi
- **Styling**: Tailwind CSS
- **State**: Zustand with persistence
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd splitbase

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

```env
# Your app's public URL
NEXT_PUBLIC_URL=http://localhost:3000

# Optional: OnchainKit API Key for enhanced features
NEXT_PUBLIC_ONCHAINKIT_API_KEY=

# Optional: WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── webhook/       # Mini app webhook handler
│   ├── .well-known/       # Farcaster manifest
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── BillCard.tsx       # Bill list item
│   ├── BillDetail.tsx     # Bill detail view
│   ├── CreateBillForm.tsx # New bill form
│   ├── EmptyState.tsx     # Empty state UI
│   ├── Header.tsx         # App header with wallet
│   ├── ParticipantList.tsx # Participant management
│   ├── PaymentActions.tsx # Payment & share actions
│   └── providers.tsx      # Context providers
├── config/
│   └── minikit.config.ts  # Mini app configuration
├── hooks/                 # Custom React hooks
├── lib/
│   ├── store.ts          # Zustand store
│   └── utils.ts          # Utility functions
└── types/
    └── index.ts          # TypeScript types
```

## Mini App Configuration

The app is configured as a Base Mini App with the following manifest at `/.well-known/farcaster.json`:

```json
{
  "frame": {
    "name": "SplitBase",
    "subtitle": "Split bills with friends instantly",
    "primaryCategory": "social",
    "tags": ["payments", "finance", "social", "bills", "usdc", "split"]
  }
}
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Set environment variables
4. Deploy!

### Publishing as a Mini App

1. Deploy your app to a public URL
2. Go to [base.dev](https://base.dev) and sign in with your Base account
3. Enter your app URL and verify the manifest
4. Sign the account association
5. Post your app URL in the Base App to publish

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project as a template for your own Base Mini Apps!

## Resources

- [Base Documentation](https://docs.base.org)
- [Mini Apps Guide](https://docs.base.org/mini-apps/introduction/overview)
- [OnchainKit](https://onchainkit.xyz)
- [Base App](https://base.org)
