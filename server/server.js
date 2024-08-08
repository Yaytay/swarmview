//server-prod.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import morgan from 'morgan';
import apiRouter from './apiRouter.js';
 
const app = express();
 
app.use(morgan('combined'))
app.use(apiRouter)
app.get('/health', (_, res) => {
  res.send('up')
})
app.use(express.static(path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'dist'), { index: false }));
 
app.get('*', async (_, res) => {
  try {
    const template = fs.readFileSync('dist/index.html', 'utf-8');
    res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
  } catch (error) {
    res.status(500).end(error.toString());
  }
});
 
app.listen(5173, () => {
  console.log('http://localhost:5173/');
});