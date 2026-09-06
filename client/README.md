react-google-recaptcha-v3 setup to login page 

1. pnpm add react-google-recaptcha
   pnpm add -D @types/react-google-recaptcha


2. .env file : 
NEXT_PUBLIC_RECAPTCHA_SITE_KEY= your google captcha api key 
RECAPTCHA_SECRET_KEY=your google captcha api key 

3. create a file : (auth)/Recaptchav2.tsx


4. https://www.google.com/recaptcha/admin/create  go this url and  generate api key 



🍽️ Restaurant Management System (CMS)
A modern, responsive, and feature-rich Content Management System (CMS) built for managing restaurant operations, online orders, bill generation, and real-time dashboard analytics.

✨ Features
📊 Real-time Dashboard:

Live revenue and order metrics.

Payment distribution breakdown with dynamic theme color integration.

Recent bill activity with status tracking.

🧾 Bills & Invoicing:

Generate and edit bills for table orders.

Auto-calculation of sub-totals, discounts, VAT/taxes, and grand totals.

Instant live bill previews during creation.

PDF export functionality.

🛒 Order Management:

Track active, unpaid, and completed orders.

Sound and visual alert notifications for incoming orders.

🎨 Customization & Accessibility:

Dynamic theme accent colors (primaryColor configuration).

Fully responsive mobile and desktop layout.

🛠️ Tech Stack
Framework: Next.js (React)

Styling: Tailwind CSS

Component UI: Ant Design, Lucide React Icons

Form Handling: React Hook Form

Animations: Framer Motion

Charts: Recharts

Date Utilities: date-fns

Toast Notifications: Sonner




