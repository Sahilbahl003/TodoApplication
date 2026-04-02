import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "../../../../../lib/db";

export async function PUT(req,{params}){

const token = req.headers.get("authorization")?.split(" ")[1]
const decoded = jwt.verify(token,process.env.JWT_SECRET)

const {id} =await params
const {completed} = await req.json()

const result = await pool.query(
`UPDATE subtasks
SET completed=$1
WHERE id=$2 AND user_id=$3
RETURNING *`,
[completed,id,decoded.id]
)

return NextResponse.json(result.rows[0])

}

export async function DELETE(req,{params}){

const token = req.headers.get("authorization")?.split(" ")[1]
const decoded = jwt.verify(token,process.env.JWT_SECRET)

const {id} =await params

await pool.query(
`DELETE FROM subtasks
WHERE id=$1 AND user_id=$2`,
[id,decoded.id]
)

return NextResponse.json({message:"Deleted"})
}