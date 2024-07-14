import express from "express";
import proxy from "express-http-proxy"

const router = express.Router();

router.use('/api', proxy('uat-swarm-01-node2.groupgti.net:2375', {
  filter: (req, res) => { 
    console.log('Request to ' + req.url)
    return req.method === 'GET'
  }
}));

export default router;
