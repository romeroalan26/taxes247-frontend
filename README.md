
# Taxes247 Frontend

This is the frontend of the **Taxes247** application — a modern tax request tracking system built for ease of use by clients and control by administrators.

## 🌐 Live Demo

🌍 [https://taxes247.vercel.app](https://taxes247.vercel.app)

## 📦 Tech Stack

- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **State Management:** Context API
- **Forms & Validation:** React Hook Form
- **Charts:** Chart.js (via react-chartjs-2)
- **Icons:** Lucide React
- **Date Pickers:** react-datepicker
- **Auth:** Firebase Authentication
- **File Uploads:** AWS S3 via backend

## 🧩 Features

### 🧾 Users

- Register/login (standard and Google OAuth)
- Submit new tax requests with a form
- Upload W2 files
- Receive confirmation code via email
- Check request status
- Switch between light/dark mode

### 🛠 Admin

- Login as admin (role-verified)
- Admin dashboard:
  - Table of all requests with search & filters
  - Update request status
  - Add admin notes
  - Delete requests (with confirmation)
  - View key statistics (pie chart + bar chart)

## 🗂 Folder Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── RequestsTable.jsx
│   │   ├── RequestDetailsModal.jsx
│   │   ├── StatisticsPanel.jsx
│   │   ├── StatusUpdateForm.jsx
│   │   └── modals/DeleteConfirmationDialog.jsx
├── context/AuthContext.jsx
├── firebaseConfig.js
├── App.jsx
└── main.jsx
```

## 🚀 Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/romeroalan26/taxes247-frontend.git
   ```

2. Install dependencies:
   ```bash
   cd taxes247-frontend
   npm install
   ```

3. Create a `.env` file and configure Firebase and backend URL:

```env
VITE_API_URL=https://your-backend-url/api
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

4. Run the app:
   ```bash
   npm run dev
   ```

## ✨ Skills Practiced

- React UI design with modals, tables and responsive components
- Form handling and conditional validation
- Firebase user auth integration
- Admin-only route control
- Integration with RESTful APIs
- Dark/light theme toggling

---

Developed by **Alan Joel Romero De Oleo**
