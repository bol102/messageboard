
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

const messagesFile = path.join(__dirname, "messages.json");
let messages = [];
if (fs.existsSync(messagesFile)) {
    try {
        messages = JSON.parse(fs.readFileSync(messagesFile, "utf-8"));
    } catch (err) {
        console.error("Error reading messages.json:", err);
        messages = [];
    }
}
function saveMessages() {
    fs.writeFile(messagesFile, JSON.stringify(messages, null, 2), (err) => {
        if (err) console.error("Error saving messages:", err);
    });
}

function genId() {
    return String(Date.now()) + "-" + Math.random().toString(36).slice(2,8);
}

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.emit("initMessages", messages);

    socket.on("newMessage", (msg) => {
        // assign id if not present
        const newMsg = Object.assign({}, msg);
        newMsg.id = newMsg.id || genId();
        messages.push(newMsg);
        saveMessages();
        io.emit("newMessage", newMsg);
    });

    socket.on("updateMessage", (update) => {
        // update: { id, html, images, doodle, bgColor }
        const idx = messages.findIndex(m => m.id === update.id);
        if (idx !== -1) {
            messages[idx] = Object.assign({}, messages[idx], update);
            saveMessages();
            io.emit("updateMessage", messages[idx]);
        }
    });

    socket.on("deleteMessage", ({ id }) => {
        const idx = messages.findIndex(m => m.id === id);
        if (idx !== -1) {
            messages.splice(idx, 1);
            saveMessages();
            io.emit("deleteMessage", { id });
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
