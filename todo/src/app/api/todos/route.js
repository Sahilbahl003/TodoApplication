import pool from "../../../../lib/db";

export async function GET() {
  const result = await pool.query(
    "SELECT * FROM todos ORDER BY id DESC"
  );
  return Response.json(result.rows);
}

export async function POST(req) {
  const { title,todo_date } = await req.json();

  //  VALIDATION
  if (!title || !title.trim()) {
    return new Response(
      JSON.stringify({ message: "Title is required" }),
      { status: 400 }
    );
  }

  const result = await pool.query(
    "INSERT INTO todos(title,todo_date) VALUES($1,$2) RETURNING *",
    [title,todo_date]
  );

  return Response.json(result.rows[0]);
}
