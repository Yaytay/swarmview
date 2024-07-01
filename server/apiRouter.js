import express from "express";
import proxy from "express-http-proxy"

const router = express.Router();

router.get("/api/msg", (_req, res) => {
  res.json({ message: "Hello, " + _req.url + "!" });
});

router.use('/api', proxy('uat-swarm-01-node2.groupgti.net:2375', {
  filter: function (req, res) { 
    console.log('Request to ' + req.url)
    return new Promise(function (resolve) { 
      resolve(req.method === 'GET');
    }); 
  }
}));

export default router;
