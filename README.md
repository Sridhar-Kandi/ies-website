# IES Lab Website v8

## Quick Start
```bash
npm install
npm run dev
```

## Access
- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/#admin
- **Login**: admin / ies2026secure

## What's New in v8
- **Personal website pages for ALL members** — Professor, Senior Researchers, and PhD Students all have individual profile pages with bio, publications, projects, etc. Accessed via "Website" button on their cards.
- **Image upload from computer** — Every image field in the admin panel now shows both a URL input and an "Upload" button. Upload from your computer and the image is saved to `public/uploads/`.
- **Bio editor for all member types** — Senior Researchers and PhD Students now have the same bio/publications/projects editor as the Professor in the admin panel.
- **No references link** — Removed from senior researchers, replaced with Website button.

## Architecture
```
server/index.js          ← Express API + image upload (multer)
public/uploads/          ← Uploaded images stored here
src/admin/
  ├── AdminDashboard.jsx ← Full CRUD with ImageUploader
  ├── ImageUploader.jsx  ← URL input OR file upload component
  ├── AdminLogin.jsx
  ├── AdminApp.jsx
  └── api.js
src/pages/
  ├── MemberProfile.jsx  ← Generic profile page for any member
  ├── MembersPage.jsx    ← Website button on all researcher cards
  └── ...
```
