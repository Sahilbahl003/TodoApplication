import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../../../../lib/db";

export async function POST(req) 
{
const { email, password } = await req.json();
const user = await pool.query("SELECT * FROM users WHERE email=$1",[email]);
if (user.rows.length === 0) {return Response.json({ message: "User not found" },{status:400});}
const valid = await bcrypt.compare(password,user.rows[0].password);
if (!valid) {return Response.json({ message: "Wrong password" },{status:400});}
const token = jwt.sign({ id: user.rows[0].id },process.env.JWT_SECRET);
return Response.json({ token });
}