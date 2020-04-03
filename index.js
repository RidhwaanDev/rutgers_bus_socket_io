const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const axios = require('axios'); 

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
 	
});

io.on('connection', (socket) => {
  console.log("connected");
  setInterval(function(){
   getVehiclesData()
	.then(result => {
  	 const response  = result['data'];
         const data = response['data'];
         const data_unwrapped = data['1323'];
         socket.emit('vehicles', data_unwrapped);
  	})
  	.catch(error => { console.log(error)});
  }, 1000);
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

// when the client connects to the backend, make loop to vehicle data 

function getVehiclesData(){
 const URL = "https://transloc-api-1-2.p.rapidapi.com/vehicles.json";  
 const h = { headers: {
     'X-RapidAPI-Host': 'transloc-api-1-2.p.rapidapi.com',
     'X-RapidAPI-Key':'hHcLr1qWHDmshwibREtIrhryL9bcp1Fw9AQjsnCiZyEzRrJKOS',
   },
  params : {
   'agencies' : '1323' 
 } 
};
 return axios.get(URL,h);
}
