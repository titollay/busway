const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } // Allow all for local testing
});

app.use(express.json());

// Endpoint for PHP to send fleet updates
app.post('/update-bus', (req, res) => {
  const { fleet } = req.body;
  if (fleet) {
    console.log(`📡 Broadcast: Received update for ${fleet.length} buses`);
    io.emit('fleet_update', fleet);
  } else {
    console.log('⚠️ Received empty fleet update');
  }
  res.json({ success: true });
});

io.on('connection', (socket) => {
  console.log('📡 Client connected to Real-time Map');
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Real-time WebSocket Server running on port ${PORT}`);
});
