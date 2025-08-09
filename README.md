# My Message Board

A real-time message board with doodles, images, and live updates using Socket.IO.  
Now supports **live syncing of edits and deletions** between all connected users.

## Running locally

```bash
npm install
npm start
```
Then open http://localhost:3000 in your browser.

Open the site in two browsers/tabs to test live sync of new messages, edits, and deletions.

## Deploying to Render

1. Push this folder to a GitHub repository.
2. Go to https://render.com, create a new Web Service.
3. Connect your GitHub repo.
4. Use:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Click "Deploy" — your app will be live.

## Persistent Storage

Messages are stored in `messages.json`. Make sure your host supports persistent disk or connect to a database if needed.
