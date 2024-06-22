import express from "express";
import * as fs from 'fs';
import * as path from 'path';

const port = process.env.PORT || 3000;

const app = express();

app.get("/api/v1/hello", (_req, res) => {
  res.json({ message: "Hello, world!" });
});

app.get('/', async (req, res, next) => {
  try {
    let html = fs.readFileSync(path.resolve('.', 'index.html'), 'utf-8')
    html = await viteServer.transformIndexHtml(req.url, html)
    res.send(html)
  } catch (e) {
    return next(e)
  }
})

app.listen(port, () => {
  console.log("Server listening on port", port);
});