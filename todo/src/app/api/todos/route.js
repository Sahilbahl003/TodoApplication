
//import pool from "@/lib/db";

import pool from "../../../../lib/db";

export async function GET() {
 const result = await pool.query("SELECT * FROM todos ORDER BY id DESC");
 return Response.json(result.rows);
}

export async function POST(req) {
const { title } = await req.json();

 const result = await pool.query(
 "INSERT INTO todos(title) VALUES($1) RETURNING *",
 [title]
 );

return Response.json(result.rows[0]);
}