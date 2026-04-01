//import { pool } from "@/lib/db";
import bcrypt from "bcrypt";
import pool from "../../../../lib/db";

export async function POST(req) {

 const { name, email, password } = await req.json();
 const existingUser = await pool.query("SELECT * FROM users WHERE email=$1",[email]);
 if (existingUser.rows.length > 0) {
   return Response.json({ message: "User already exists" }, { status: 400 });
 }

 const hashedPassword = await bcrypt.hash(password, 10);

 await pool.query(
   "INSERT INTO users (name,email,password) VALUES ($1,$2,$3)",
   [name, email, hashedPassword]
 );

 return Response.json({ message: "User created" });
}