import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "todos.json");

function readTodos() {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

function writeTodos(todos) {
  fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));
}

// GET
export async function GET() {
  const todos = readTodos();
  return NextResponse.json(todos);
}

// POST
export async function POST(req) {
  const formData = await req.formData();

  const title = formData.get("title");
  const image = formData.get("image");

  const buffer = Buffer.from(await image.arrayBuffer());

  const uploadPath = path.join(
    process.cwd(),
    "public",
    "uploads",
    image.name
  );

  fs.writeFileSync(uploadPath, buffer);

  const todos = readTodos();

  const newTodo = {
    id: Date.now(),
    title,
    image: `/uploads/${image.name}`,
  };

  todos.push(newTodo);
  writeTodos(todos);

  return NextResponse.json(newTodo);
}

export async function DELETE(req) {
  const { id } = await req.json();

  const filePath = path.join(process.cwd(), "data", "todos.json");
  const fileData = fs.readFileSync(filePath, "utf-8");
  const todos = JSON.parse(fileData);

  const filtered = todos.filter((todo) => todo.id !== id);

  fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2));

  return NextResponse.json({ message: "Deleted" });
}