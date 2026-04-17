const https = require('https');

const data = JSON.stringify({
  password: "Admin@CSGC#",
  team_name: "Drift Station",
  leader_name: "Dantani Ashish",
  leader_email: "deepakdantani678@gmail.com",
  leader_phone: "7990060373",
  leader_school: "Kailash Vidhaylai",
  player2_name: "Dataniya Harsh",
  player2_phone: "6354028708",
  player2_school: "Gujarat Commerce College",
  player3_name: "Jigar Prajapati",
  player3_phone: "9624362454",
  player3_school: "B N Patel Institute of Paramedical and Science",
  player4_name: "Dantani Jay",
  player4_phone: "7041188085",
  player4_school: "Kailash Vidhayla"
});

const options = {
  hostname: 'ff-tournament.vercel.app',
  path: '/api/add-registration',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => console.log(body));
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();