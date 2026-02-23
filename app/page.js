"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");

  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSubmit = async () => {
    if (!title) return;

    const formData = new FormData();
    formData.append("title", title);
    if (image) formData.append("image", image);

    await fetch("/api/todos", {
      method: "POST",
      body: formData,
    });

    setTitle("");
    setImage(null);
    setFileName("");
    fetchTodos();
  };

  const handleDelete = async (id) => {
    await fetch("/api/todos", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    fetchTodos();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
           Todo App
        </h1>

        {/* FORM */}
        <div className="space-y-4">

          <input
            type="text"
            placeholder="Nhập công việc..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Custom file input */}
          <label className="block">
            <span className="sr-only">Choose file</span>
            <input
              type="file"
              onChange={(e) => {
                setImage(e.target.files[0]);
                setFileName(e.target.files[0]?.name || "");
              }}
              className="block w-full text-sm text-gray-900
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-700"
            />
          </label>

          {fileName && (
            <p className="text-sm text-gray-700">
              Đã chọn: {fileName}
            </p>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Thêm công việc
          </button>
        </div>

        {/* LIST */}
        <div className="mt-10 space-y-5">
          {todos.length === 0 && (
            <p className="text-center text-gray-600">
              Chưa có công việc nào 
            </p>
          )}

          {todos.map((todo) => (
            <div
              key={todo.id}
              className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <p className="text-lg font-semibold text-gray-900">
                  {todo.title}
                </p>

                <button
                  onClick={() => handleDelete(todo.id)}
                  className="text-red-600 font-medium hover:text-red-800"
                >
                  Xoá
                </button>
              </div>

              {todo.image && (
                <img
                  src={todo.image}
                  alt="todo"
                  className="mt-4 rounded-lg shadow-md max-h-60 object-cover"
                />
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}