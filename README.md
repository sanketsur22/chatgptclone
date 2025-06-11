# ChatGPT Clone - Next.js

A modern, feature-rich ChatGPT clone built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui components. Powered by OpenAI's GPT-4o model through the AI SDK.

## Features

- 🤖 **AI-Powered Chat**: Real-time conversations with OpenAI's GPT-4o
- 🎨 **Modern UI**: Beautiful, responsive design with shadcn/ui components
- 🌙 **Dark/Light Mode**: Toggle between themes
- 📱 **Mobile Responsive**: Works perfectly on all devices
- ⚡ **Real-time Streaming**: Live response streaming for better UX
- 💬 **Message Actions**: Copy, like/dislike messages
- 🔄 **Conversation History**: Sidebar with recent conversations
- ⌨️ **Keyboard Shortcuts**: Enter to send, Shift+Enter for new lines
- 🎯 **Example Prompts**: Quick-start conversation starters
- 🔧 **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **AI Integration**: Vercel AI SDK with OpenAI
- **Icons**: Lucide React
- **Theme**: next-themes

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd chatgpt-clone-nextjs
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install

# or

yarn install

# or

pnpm install
\`\`\`

3. Set up environment variables:

   Copy the `.env.example` file to `.env.local` and add your OpenAI API key:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

   Then edit `.env.local` and add your OpenAI API key:
   \`\`\`
   OPENAI_API_KEY=your_openai_api_key_here
   \`\`\`

4. Set up environment variables:
   Create a `.env.local` file in the root directory:
   \`\`\`env
   OPENAI_API_KEY=your_openai_api_key_here
   \`\`\`

5. Run the development server:
   \`\`\`bash
   npm run dev

# or

yarn dev

# or

pnpm dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
├── app/
│ ├── api/chat/ # Chat API route
│ ├── globals.css # Global styles
│ ├── layout.tsx # Root layout
│ └── page.tsx # Home page
├── components/
│ ├── ui/ # shadcn/ui components
│ ├── chat-interface.tsx # Main chat component
│ ├── header.tsx # App header
│ ├── sidebar.tsx # Navigation sidebar
│ └── theme-toggle.tsx # Theme switcher
├── hooks/
│ └── use-toast.ts # Toast notifications
└── lib/
└── utils.ts # Utility functions
\`\`\`

## Key Components

### ChatInterface

The main chat component that handles:

- Message display and formatting
- Real-time streaming responses
- User input and form submission
- Message actions (copy, feedback)

### API Route

Located at `/app/api/chat/route.ts`, this handles:

- OpenAI API integration
- Message streaming
- Error handling
- Request validation

### Sidebar

Navigation component featuring:

- Conversation history
- New chat creation
- Settings access
- Mobile-responsive drawer

## Customization

### Styling

The app uses Tailwind CSS with custom CSS variables defined in `globals.css`. You can customize:

- Color schemes
- Typography
- Spacing
- Animations

### AI Model

To change the AI model, edit the API route:
\`\`\`typescript
const result = streamText({
model: openai("gpt-4o"), // Change model here
messages,
// ... other options
})
\`\`\`

### UI Components

All UI components are from shadcn/ui and can be customized by modifying the files in `components/ui/`.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `OPENAI_API_KEY` environment variable
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

| Variable         | Description         | Required |
| ---------------- | ------------------- | -------- |
| `OPENAI_API_KEY` | Your OpenAI API key | Yes      |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [OpenAI](https://openai.com) for the GPT models
- [Vercel](https://vercel.com) for the AI SDK
- [shadcn](https://ui.shadcn.com) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com) for the styling system
