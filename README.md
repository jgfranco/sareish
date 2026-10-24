# Sareish

Source for [sareish.com](https://sareish.com): a link-in-bio homepage for Sareish's home decor and lifestyle content, plus a private editor for managing the links.

Built with Next.js (pages router), MongoDB (Mongoose), NextAuth (email + password) and Cloudinary for photo uploads. Deployed on Vercel.

## Pages

| Path | What it is |
| --- | --- |
| `/` | Homepage: list or photo view of the active links. Static, rebuilt every 60s and whenever a link is saved. |
| `/about`, `/contact` | Static pages |
| `/login` | Admin login |
| `/linksEditor` | Add, edit, delete and reorder links (login required) |

## API

| Route | Auth | Purpose |
| --- | --- | --- |
| `/api/links` | yes | `GET` list, `POST` add, `PATCH` update, `DELETE` remove a link |
| `/api/upload` | yes | Upload one image (max 10 MB) to Cloudinary, returns its URL |
| `/api/clicks` | no | Counts a click on a homepage link |
| `/api/auth/*` | | NextAuth |

## Environment variables

Set these in Vercel (Project → Settings → Environment Variables) and in `.env.local` for local development:

| Name | Needed for |
| --- | --- |
| `MONGO_URL` | Everything (MongoDB connection string) |
| `NEXTAUTH_SECRET` | Login. Generate with `openssl rand -base64 32` |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Photo uploads in the editor |

`NEXTAUTH_URL` is only needed locally (`http://localhost:3000`); Vercel detects it automatically.

## Local development

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

There is no public sign-up. Admin accounts live in the `users` collection in MongoDB (password hashed with bcrypt).
