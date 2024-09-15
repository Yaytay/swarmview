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

if (process.env.DOCKER_PROXY_CAPTURE_FOR_MOCK === 'true') {
  function logResponseBody(req, res, next) {
    if (req.path.startsWith('/docker') || req.path.startsWith('/api')) {

      const origPath = req.path
      var oldWrite = res.write,
        oldEnd = res.end;

      var chunks = [];

      res.write = function (chunk) {
        chunks.push(Buffer.copyBytesFrom(chunk));

        oldWrite.apply(res, arguments);
      };

      res.end = function (chunk) {
        if (chunk)
          chunks.push(Buffer.copyBytesFrom(chunk));
        
        var body = Buffer.concat(chunks).toString('utf8');
        const path = 'server/mock' + origPath
        const dir = path.split('/').slice(0, -1).join('/')
        try {
          fs.mkdirSync(dir, {recursive: true})
          fs.writeFileSync(path, body)
        } catch (error) {
          console.log(error)
        }

        oldEnd.apply(res, arguments);
      };

    }
    next();
  }
  app.use(logResponseBody);
} else if (process.env.DOCKER_PROXY_MOCK === 'true') {
  function mockResponseBody(req, res, next) {
    if (req.path.startsWith('/docker') || req.path.startsWith('/api')) {

      const origPath = req.path

      try {
        const path = 'server/mock' + origPath
        const body = fs.readFileSync(path)
        res.status(200).end(body)
      } catch (error) {
        console.log(error)
      }
  } else {
      next();
    }
  }
  app.use(mockResponseBody);
}

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