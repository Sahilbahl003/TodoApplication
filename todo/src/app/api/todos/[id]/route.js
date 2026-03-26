// import pool from "@/lib/db";

import pool from "../../../../../lib/db";

export async function PUT(req, { params }) {
const { title, completed } = await req.json();
const {id} = await params;

const result = await pool.query(
"UPDATE todos SET title=$1, completed=$2 WHERE id=$3 RETURNING *",
[title, completed,id]
);

 return Response.json(result.rows[0]);
}

export async function DELETE(req, { params }) {
    const {id} = await params;
 await pool.query("DELETE FROM todos WHERE id=$1", [id]);

 return Response.json({ message: "Deleted" });
}