import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "../../../../../../lib/db";

export async function POST(req,{params}){

const token = req.headers.get("authorization")?.split(" ")[1]
const decoded = jwt.verify(token,process.env.JWT_SECRET)

const {id} =await params
const {title,subtask_date} = await req.json()

if(!title || !title.trim()){
return NextResponse.json({message:"Title required"},{status:400})
}

const result = await pool.query(
`INSERT INTO subtasks(todo_id,title,user_id,subtask_date)
VALUES($1,$2,$3,$4)
RETURNING *`,
[id,title,decoded.id,subtask_date || null]
)

return NextResponse.json(result.rows[0])

}


export async function GET(req,{params}){

const token = req.headers.get("authorization")?.split(" ")[1]
const decoded = jwt.verify(token,process.env.JWT_SECRET)

const {id} = await params

const result = await pool.query(
`SELECT * FROM subtasks
WHERE todo_id=$1 AND user_id=$2
ORDER BY id`,
[id,decoded.id]
)

return NextResponse.json(result.rows)

}



