# Omagize

This project is a simple Modern Web Chat App
<br>
Go to The [App Source](./apps/web/)

in-App Screenshot (old)
![alt text](./documents/screenshot.svg)

## Setup the Environment

To run this project, You need to install [Node.js](https://nodejs.org/), [pNpM](https://pnpm.io/)
<br>
You should install [NX](https://nx.dev/) to build or deploy the app (Optional)

After that, You must install dependencies by using `pnpm install` in order to test on your local machine

### Run the project

This will launch the Web App in dev environment
`pnpm run start`

## Tech Stack

**Website Images:** [unDraw](https://undraw.co/)
<br>
**3rd party Services:** Firebase

### Frontend

- **Language:** Typescript
- **Project Management:** NX, PNPM
- **Tools & Libraries:** Vite, React, Chakra UI

### Backend

- **Language:** Kotlin
- **Database:** PostgreSQL, Exposed
- **Tools & Libraries:** Ktor server, Socket.io

## Index

`apps/web/` - Main web application
<br>
`apps/web/src/index.tsx` - Index page of the app & init services
<br>
`libs/web/api` - API library of Omagize
<br>
`libs/web/api/src/firebase` - Firebase config and files
