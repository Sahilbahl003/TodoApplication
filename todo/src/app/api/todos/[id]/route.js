import pool from "../../../../../lib/db";

/* GET SINGLE TODO */

export async function GET(req, { params }) {
  const { id } = await params;

  if (!id) {
    return new Response(
      JSON.stringify({ message: "ID is required" }),
      { status: 400 }
    );
  }

  const result = await pool.query(
    "SELECT id, title, completed, todo_date::text FROM todos WHERE id = $1",
    [id]
  );

  if (result.rows.length === 0) {
    return new Response(
      JSON.stringify({ message: "Todo not found" }),
      { status: 404 }
    );
  }

  return Response.json(result.rows[0]);
}

/* UPDATE TODO */

export async function PUT(req, { params }) {
  const { id } = await params;

  const { title, completed, todo_date } = await req.json();

  if (!title || !title.trim()) {
    return new Response(
      JSON.stringify({ message: "Title is required" }),
      { status: 400 }
    );
  }

  const result = await pool.query(
  `UPDATE todos
   SET title=$1, completed=$2, todo_date=$3
   WHERE id=$4
   RETURNING id, title, completed, todo_date::text`,
  [title, completed, todo_date, id]
);

  if (result.rows.length === 0) {
    return new Response(
      JSON.stringify({ message: "Todo not found" }),
      { status: 404 }
    );
  }

  return Response.json(result.rows[0]);
}

/* DELETE TODO */

export async function DELETE(req, { params }) {
  const { id } = await params;

  const result = await pool.query(
    "DELETE FROM todos WHERE id=$1 RETURNING *",
    [id]
  );

  if (result.rows.length === 0)  {
    return new Response(
      JSON.stringify({ message: "Todo not found" }),
      { status: 404 }
    );
  }

  return Response.json({ message: "Deleted  successfully" });
}