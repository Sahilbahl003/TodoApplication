import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import pool from "../../../../../lib/db";

/* GET SINGLE */
export async function GET(req, { params }) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const { id } = await params; 

  const result = await pool.query(
  `SELECT id, title, description, completed, todo_date::text
   FROM todos
   WHERE id=$1 AND user_id=$2`,
  [id, decoded.id]
);

  return NextResponse.json(result.rows[0]);
}

/* UPDATE */
export async function PUT(req, { params }) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const { id } = await params; 

  const { title, description, completed, todo_date } = await req.json();

  if (!title || !title.trim()) {
    return NextResponse.json(
      { message: "Title required" },
      { status: 400 }
    );
  }

  const result = await pool.query(
  `UPDATE todos
   SET title=$1, description=$2, completed=$3, todo_date=$4
   WHERE id=$5 AND user_id=$6
   RETURNING id, title, description, completed, todo_date::text`,
  [title, description, completed, todo_date, id, decoded.id]
);

  if (result.rows.length === 0) {
    return NextResponse.json(
      { message: "Todo not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(result.rows[0]); 
}

/* DELETE */
export async function DELETE(req, { params }) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const { id } = await params; 

  await pool.query(
    "DELETE FROM todos WHERE id=$1 AND user_id=$2",
    [id, decoded.id]
  );

  return NextResponse.json({ message: "Deleted successfully" });
}