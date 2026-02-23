import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

let memoryTodos = [];

const isLocal = process.env.NODE_ENV === "development";

const dataPath = path.join(process.cwd(), "data", "todos.json");
const uploadDir = path.join(process.cwd(), "public", "uploads");

function readFileTodos() {
  if (!fs.existsSync(dataPath)) return [];
  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
}

function writeFileTodos(todos) {
  fs.writeFileSync(dataPath, JSON.stringify(todos, null, 2));
}

export async function GET() {
  if (isLocal) {
    return NextResponse.json(readFileTodos());
  }
  return NextResponse.json(memoryTodos);
}

export async function POST(req) {
  const formData = await req.formData();
  const title = formData.get("title");
  const image = formData.get("image");

  let imagePath = "";

  if (image && image.size > 0) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (isLocal) {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = Date.now() + "-" + image.name;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, buffer);

      imagePath = `/uploads/${fileName}`;
    } else {
      // Online: convert sang base64
      imagePath = `data:${image.type};base64,${buffer.toString("base64")}`;
    }
  }

  const newTodo = {
    id: Date.now().toString(),
    title,
    image: imagePath,
  };

  if (isLocal) {
    const todos = readFileTodos();
    todos.push(newTodo);
    writeFileTodos(todos);
  } else {
    memoryTodos.push(newTodo);
  }

  return NextResponse.json(newTodo);
}

export async function DELETE(req) {
  const { id } = await req.json();

  if (isLocal) {
    let todos = readFileTodos();
    todos = todos.filter((t) => t.id !== id);
    writeFileTodos(todos);
  } else {
    memoryTodos = memoryTodos.filter((t) => t.id !== id);
  }

  return NextResponse.json({ message: "Deleted" });
}