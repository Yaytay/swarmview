//server-dev.js
import fs from 'fs';
import express from 'express';
import morgan from 'morgan';
import { createServer } from 'vite';
import apiRouter from './server/apiRouter.js';
 
const app = express();
 
const vite = await createServer({
  server: {
    middlewareMode: true,
  },
  appType: 'custom',
});
 
app.use(morgan('combined'))

app.use(apiRouter)

app.use(vite.middlewares);
 
app.use('{/:path}', async (req, res) => {
  const url = req.originalUrl;
 
  try {
    const index = await vite.transformIndexHtml(url, fs.readFileSync('index.html', 'utf-8'));

    res.status(200).set({ 'Content-Type': 'text/html' }).end(index);
  } catch (error) {
    console.log(error)
    res.status(500).end(error.toString());
  }
});
 
app.listen(4173, () => {
  console.log('http://localhost:4173');
});