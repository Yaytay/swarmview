import express from "express";
import proxy from "express-http-proxy"
import 'dotenv/config'

const router = express.Router();

const endpoint = process.env.DOCKER_PROXY_ENDPOINT

router.use('/api', proxy(endpoint, {
  filter: (req, res) => { 
    console.log('Request to ' + req.url)
    return req.method === 'GET'
  }
}));

export default router;
