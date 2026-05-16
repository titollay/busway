const io = require("socket.io")(4000, {
  cors: {
    origin: "*",
  },
});

console.log("📡 Socket.io server running on port 4000");

io.on("connection", (socket) => {
  console.log("👤 New client connected: " + socket.id);

  // Listen for bus alerts from drivers
  socket.on("send_bus_alert", (alertData) => {
    console.log("🚨 New alert received:", alertData);
    // Broadcast to all users
    io.emit("bus_alert", alertData);
  });

  // Position updates if needed
  socket.on("update_position", (data) => {
     io.emit("fleet_update", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });
});
