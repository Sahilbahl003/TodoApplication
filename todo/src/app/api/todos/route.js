import pool from "../../../../lib/db";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ FIX HERE
    const result = await pool.query(
      "SELECT id, title, completed, todo_date::text FROM todos WHERE user_id=$1",
      [decoded.id]
    );

    return NextResponse.json(result.rows);
  } catch {
    return NextResponse.json(
      { message: "Invalid token" },
      { status: 403 }
    );
  }
}

export async function POST(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const { title, todo_date } = await req.json();

    if (!title || !title.trim()) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      "INSERT INTO todos(title, todo_date, user_id) VALUES($1,$2,$3) RETURNING id, title, completed, todo_date::text",
      [title, todo_date, decoded.id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}