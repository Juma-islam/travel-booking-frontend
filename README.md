# 🌐 VoyageAI - Frontend Portal

This is the Next.js frontend application for **VoyageAI**, built using Next.js 16 (App Router), React 19, and Tailwind CSS 4. It interfaces with the VoyageAI backend API to present users with a seamless, AI-driven travel booking experience.

## 🚀 Technologies Used

* **Framework:** [Next.js 16](https://nextjs.org) (React 19)
* **Styling:** [Tailwind CSS 4](https://tailwindcss.com) & PostCSS
* **Animations:** [Framer Motion](https://www.framer.com/motion/) for premium, fluid UI interactions
* **Sliders & Carousels:** [Swiper.js](https://swiperjs.com/) for interactive trip galleries
* **Auth SDK:** [Firebase Client SDK](https://firebase.google.com/) for Google Sign-in integration
* **Icons:** [Lucide React](https://lucide.dev)

---

## 🛠️ Getting Started

### 📋 Prerequisites
Make sure the [VoyageAI Backend Service](../backend) is configured and running.

### ⚙️ Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   
   # Firebase Config (Required if using Google OAuth)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the client dashboard.

---

## 📸 Platform Preview

Check the [Main Project README](../README.md) for the screenshot mockup, full tech stack descriptions, environment variable details, and production deployment tutorials.
