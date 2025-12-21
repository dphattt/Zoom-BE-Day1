// server.mjs
import { createServer } from "node:http";
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
const ALLOWED_ORIGIN = process.env.CLIENT_URL || "*";

// Cục data
let taskId = 1;
const db = {
  tasks: [],
};
const serverRes = (res, data) => {
  res.writeHead(data.status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:5173/",
  });
  res.end(JSON.stringify(data));
};
const server = createServer((req, res) => {
  let response = {
    status: 200,
  };

  // GET /api/tasks
  if (req.method === "GET" && req.url === "/api/tasks") {
    response.data = db.tasks;
    serverRes(res, response);
    return;
  }

  // GET /api/tasks/:id
  if (req.method === "GET" && req.url.startsWith("/api/tasks/")) {
    const id = +req.url.split("/").pop();
    const task = db.tasks.find((task) => task.id === id);
    if (task) {
      response.data = task;
    } else {
      response.status = 404;
      response.message = "Resource not found";
    }
    serverRes(res, response);
    return;
  }

  // POST /api/tasks
  if (req.method === "POST" && req.url === "/api/tasks") {
    let body = "";
    req.on("data", (buffer) => {
      body += buffer.toString();
    });
    req.on("end", () => {
      const payload = JSON.parse(body);
      const newTask = {
        id: taskId++,
        title: payload.title,
        isCompleted: false,
      };
      db.tasks.push(newTask);
      response.status = 201;
      response.data = newTask;
      serverRes(res, response);
    });
    return;
  }

  // PUT/PATCH /api/tasks/:id
  if (
    (req.method === "PUT" || req.method === "PATCH") &&
    req.url.startsWith("/api/tasks/")
  ) {
    const id = +req.url.split("/").pop();
    const task = db.tasks.find((task) => task.id === id);
    if (task) {
      let body = "";
      req.on("data", (buffer) => {
        body += buffer.toString();
      });
      req.on("end", () => {
        try {
          const payload = JSON.parse(body);
          task.title = payload.title;
          task.isCompleted = payload.isCompleted;
          response.data = task;
          serverRes(res, response);
        } catch (error) {
          response.status = 400;
          response.message = "Invalid JSON";
          serverRes(res, response);
        }
      });
    } else {
      response.status = 404;
      response.message = "Resource not found";
      serverRes(res, response);
    }
    return;
  }

  // DELETE /api/tasks/:id
  if (req.method === "DELETE" && req.url.startsWith("/api/tasks/")) {
    const id = +req.url.split("/").pop();
    const taskIndex = db.tasks.findIndex((task) => task.id === id);
    if (taskIndex !== -1) {
      db.tasks.splice(taskIndex, 1);
      response.status = 200;
      response.message = "Delete success";
      serverRes(res, response);
    } else {
      response.status = 404;
      response.message = "Resource not found";
      serverRes(res, response);
    }
    return;
  }
});

// starts a simple http server locally on port 3000
server.listen(3000, "127.0.0.1", () => {
  console.log("Listening on 127.0.0.1:3000");
});
