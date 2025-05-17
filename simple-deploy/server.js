console.log("Server starting"); const http = require("http"); const server = http.createServer((req, res) => { res.end("Railway Deployment Works!"); }); server.listen(process.env.PORT || 3000);
