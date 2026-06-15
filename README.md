# 🛒 UrgentCart — AI-Powered Situation Shopping

> Describe your situation, get a ready-to-order cart in seconds.

UrgentCart is a quick-commerce app that uses AI to generate personalized shopping carts based on your current situation. Say "guests arriving in 30 minutes" or "I have a fever" and the app builds a complete cart with relevant products, estimated delivery, and one-tap checkout.

Built for the **Amazon Hackathon**.

---

## How It Works

1. User describes a situation (e.g., "movie night with friends")
2. AI (AWS Bedrock / Claude) analyzes the situation and generates a cart
3. User reviews the suggested cart (preview mode) and confirms
4. Payment via Razorpay → Order placed → Delivery tracking

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Frontend | React 19, Tailwind CSS 4, Zustand |
| AI Engine | AWS Bedrock (Claude 3 Haiku) |
| Authentication | AWS Cognito |
| Database | AWS DynamoDB |
| Payments | Razorpay |
| Deployment | GitHub Actions + AWS |

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open http://localhost:3000

---

## AWS Integration

### AWS Bedrock (AI Cart Generation)

The app uses **AWS Bedrock** with **Claude 3 Haiku** model to:
- Understand natural language situations
- Generate relevant product carts
- Modify carts based on follow-up messages
- Personalize based on user history and preferences

**Required credentials:**
```env
NEXT_PUBLIC_AI_PROVIDER=bedrock
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
```

**How to get these:**
1. Go to AWS Console → IAM → Users → Create user
2. Attach policy: `AmazonBedrockFullAccess`
3. Create access key → Copy Key ID and Secret
4. Make sure Bedrock model access is enabled in your region

### AWS Cognito (Authentication)

Handles user signup, login, email/phone verification, and JWT token management.

**Required credentials:**
```env
AUTH_MODE=cognito
COGNITO_REGION=ap-south-1
COGNITO_USER_POOL_ID=<your-pool-id>
COGNITO_CLIENT_ID=<your-client-id>
```

**How to get these:**
1. AWS Console → Cognito → Create User Pool
2. Configure sign-in (phone + password)
3. Create App Client (no client secret)
4. Copy User Pool ID and Client ID

### AWS DynamoDB (Database)

Stores user orders, conversations, preferences, and product data persistently.

**Required credentials:**
```env
USE_DYNAMODB=true
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=<same-as-above>
AWS_SECRET_ACCESS_KEY=<same-as-above>
DYNAMODB_TABLE_PREFIX=urgentcart_
```

Tables are defined in `docs/dynamodb-tables.md`.

---

## Razorpay Integration

Handles real payment processing with UPI, cards, netbanking, and wallets.

**Flow:**
1. User clicks "Buy Now" → Frontend calls `/api/payments/create-order`
2. Backend creates a Razorpay order → Returns order ID + key
3. Frontend opens Razorpay checkout popup
4. User completes payment → Razorpay sends callback
5. Frontend calls `/api/payments/verify` with payment signature
6. Backend verifies signature → Marks order as paid
7. Razorpay webhook (`/api/payments/webhook`) handles async confirmations

**Required credentials:**
```env
PAYMENT_MODE=razorpay
RAZORPAY_KEY_ID=<your-key-id>
RAZORPAY_KEY_SECRET=<your-key-secret>
RAZORPAY_WEBHOOK_SECRET=<your-webhook-secret>
```

**How to get these:**
1. Sign up at https://dashboard.razorpay.com
2. Settings → API Keys → Generate Key
3. Copy Key ID and Key Secret
4. Settings → Webhooks → Create webhook for payment events
5. Set webhook URL: `https://your-domain.com/api/payments/webhook`
6. Copy webhook secret

---

## Environment Variables (.env.local)

```env
# Auth Mode: "local" (mock) or "cognito" (real AWS)
AUTH_MODE=local

# AI Provider: "mock" (local) or "bedrock" (real AWS)
NEXT_PUBLIC_AI_PROVIDER=mock

# Payment Mode: "local" (mock) or "razorpay" (real)
PAYMENT_MODE=local

# AWS Credentials (needed for bedrock, cognito, dynamodb)
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

# Cognito
COGNITO_USER_POOL_ID=
COGNITO_CLIENT_ID=

# Bedrock
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# DynamoDB (optional)
USE_DYNAMODB=false
DYNAMODB_TABLE_PREFIX=urgentcart_
```

**Currently:** Everything runs in mock/local mode. No real AWS or Razorpay credentials needed for development.

---

## Project Structure

This is a **Next.js full-stack app** — frontend and backend live in the same codebase:

### Frontend (UI & Pages)
```
src/app/page.tsx              → Home page
src/app/ask-ai/              → AI chat interface
src/app/cart/                 → Cart with preview/confirm
src/app/checkout/            → Checkout page
src/app/emergency/           → Emergency kits
src/app/login/               → Login & signup
src/app/reorder/             → Past orders
src/app/order-success/       → Order confirmation
src/components/              → All React components
src/stores/                  → Zustand state stores
src/hooks/                   → Custom React hooks
```

### Backend (API Routes)
```
src/app/api/auth/            → Login, signup, verify, refresh, me
src/app/api/generate-cart/   → AI cart generation endpoint
src/app/api/modify-cart/     → AI cart modification endpoint
src/app/api/orders/          → Order creation & history
src/app/api/payments/        → Razorpay create, verify, webhook
src/app/api/products/        → Product catalog
src/app/api/conversations/   → Chat conversation storage
```

### Shared (Services, Libraries, Data)
```
src/services/ai/             → AI provider (mock + bedrock)
src/services/payments/       → Payment provider (mock + razorpay)
src/lib/auth/                → Auth logic (local + cognito)
src/lib/dynamodb.ts          → DynamoDB client
src/data/                    → Product catalog, emergencies, trending
src/schemas/                 → Zod validation schemas
src/types/                   → TypeScript type definitions
```

---

## Key Features

- **AI Cart Generation** — Natural language → complete shopping cart
- **Smart Modify vs Regenerate** — Says "add desserts"? Modifies. Says "I have fever"? Regenerates entire cart
- **Cart Preview** — Suggested carts need user confirmation before checkout
- **Emergency Mode** — 10 pre-built emergency kits (fever, power cut, baby care, etc.)
- **Reorder** — One-tap reorder from past orders with counter
- **Clear Cart** — In AI chat, clear everything and start fresh
- **Location Detection** — Auto-detect user location via browser geolocation
- **Auth** — Only signed-up accounts can login (no random logins)

---

## AWS Free Tier — How to Get Started

You can use AWS for free (limited usage). Here are the direct links:

1. **Create AWS Account (Free Tier):**
   https://aws.amazon.com/free/

2. **AWS Bedrock (AI) — Free trial:**
   https://aws.amazon.com/bedrock/pricing/
   - Claude 3 Haiku: first 3 months free (limited tokens)

3. **AWS Cognito (Auth) — Always free:**
   https://aws.amazon.com/cognito/pricing/
   - 50,000 monthly active users free forever

4. **AWS DynamoDB (Database) — Always free:**
   https://aws.amazon.com/dynamodb/pricing/
   - 25 GB storage + 25 read/write units free forever

5. **Create IAM credentials:**
   https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html

6. **Razorpay Test Mode (Free):**
   https://dashboard.razorpay.com/signup
   - Test mode is completely free, no money charged
   - Use test card: 4111 1111 1111 1111

---

## Team

Built for Amazon Hackathon 2025.
