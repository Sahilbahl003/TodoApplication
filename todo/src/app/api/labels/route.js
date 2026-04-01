//import pool from "@/lib/db"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"
import pool from "../../../../lib/db"

/* GET LABELS */
export async function GET(req) {

const token = req.headers.get("authorization")?.split(" ")[1]
const decoded = jwt.verify(token, process.env.JWT_SECRET)

const result = await pool.query(
  "SELECT * FROM labels WHERE user_id=$1",
  [decoded.id]
)

return NextResponse.json(result.rows)

}

/* CREATE LABEL */
export async function POST(req){

const token = req.headers.get("authorization")?.split(" ")[1]
const decoded = jwt.verify(token, process.env.JWT_SECRET)

const { name } = await req.json()

const result = await pool.query(
  "INSERT INTO labels(name,user_id) VALUES($1,$2) RETURNING *",
  [name, decoded.id]
)

return NextResponse.json(result.rows[0])

}
