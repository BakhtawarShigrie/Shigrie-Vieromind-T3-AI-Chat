<div align="center">
# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.
</div>
<div align="center">

# 🤖 AI Therapy Chat Simulation ✨

**Observe and participate in engaging debates between AI personas!**

[![Next.js](https://img.shields.io/badge/Next.js-13+-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) [![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.x-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/) [![Gemini API](https://img.shields.io/badge/Gemini_API-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

</div>

---

## 🎯 Project Overview

This responsive web application simulates debates and discussions between distinct AI personalities on a variety of user-selected topics. It leverages **Google's Gemini Pro API** to generate dynamic AI responses. Users can not only observe the unfolding conversation but also actively participate using text input or integrated **speech-to-text**.

---

## 🔥 Key Features

* **Topic Selection:** Browse and select debate topics from visually appealing cards featuring a ✨ **crystal hover effect**.
* **Random Topic:** Instantly start a discussion on a randomly chosen subject.
* **AI Simulation:** Watch AI participants argue and discuss, driven by Gemini Pro.
* **User Interaction:** Seamlessly join the chat via a dedicated input area.
* **🎤 Speech-to-Text:** Dictate your messages using the microphone button (with automatic pause detection).
* **Conversation Controls:**
    * ⏯️ **Pause/Resume:** Control the flow of the AI conversation.
    * ⏩ **Speed Adjustment:** Change the delay between AI turns (1x, 1.5x, 2x, etc.).
    * 🔄 **Restart:** Begin the current topic's debate anew.
    * 💾 **Export Transcript:** Download the chat history as **TXT**, **JSON**, or **PDF**, with options to include/exclude timestamps, names, typing indicators, and user messages.
* **📱 Responsive UI:** Smooth experience across desktop, tablet, and mobile devices.
* **✨ Animations:** Engaging interface enhancements powered by **Framer Motion**.
* **Modals:** Intuitive popups for AI profiles, confirmations, export settings, and mobile actions.

---

## 🖥️ UI Walkthrough

The application interface is designed for clarity and ease of use.

### 1. Topic Selection

* **Layout:** A clean grid displays available topics.
* **Interaction:** Hovering over cards triggers a subtle "crystal" lighting effect. Clicking selects a topic.
* **Actions:** Prominent "Start Conversation" and "Random Topic" buttons.

### 2. Chat Interface

* **Layout:** Classic chat layout with a participant sidebar (drawer on mobile) and main message area.
* **Header (Desktop):** Shows current topic, dropdown to switch topics, and main control buttons (Pause, Restart, Speed, Export, Share).
* **Header (Mobile):** Features a hamburger menu for the sidebar, displays the current topic (clickable), and an actions menu (⋮) for controls.
* **Sidebar:** Lists participants with avatars and names. Clicking opens a profile modal for AI personas. Includes a "Check stats" button on mobile.
* **Message Area:** Displays messages with avatars, names, timestamps, and styled bubbles. User messages align right. A typing indicator shows AI activity. A "Scroll Down" button appears when not at the bottom.
* **Input Area:** Textarea with character counter, microphone button (pulses red/yellow when active), and send button.

---

## 🛠️ Technology Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **AI Model:** [Google Gemini API](https://ai.google.dev/) (`gemini-pro`)
* **Animation:** [Framer Motion](https://www.framer.com/motion/)
* **PDF Generation:** [jsPDF](https://github.com/parallax/jsPDF)
* **Client-Side IDs:** `crypto.randomUUID()`

---

## 🚀 Get Started Locally

1.  **Clone:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```
2.  **Install:**
    ```bash
    npm install
    # or yarn / pnpm
    ```
3.  **Environment Setup:**
    * Create a `.env.local` file in the project root.
    * Add your Gemini API key:
        ```dotenv
        NEXT_PUBLIC_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
        ```
4.  **Run:**
    ```bash
    npm run dev
    # or yarn dev / pnpm dev
    ```
5.  **Open:** `http://localhost:3000`

---

## 🔮 Potential Future Ideas

* User Accounts & Saved Chats
* Database Integration (e.g., NeonDB + Prisma)
* Real-time Collaboration Features
* Advanced AI Persona Configuration
* Streaming AI Responses
