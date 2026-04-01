//import pool from "@/lib/db"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"
import pool from "../../../../../../lib/db"

export async function POST(req,{params}){

const token = req.headers.get("authorization")?.split(" ")[1]
const decoded = jwt.verify(token, process.env.JWT_SECRET)

const { id } = await params;
const { labelIds } = await req.json()


await pool.query(
  "DELETE FROM todo_labels WHERE todo_id=$1",
  [id]
)


for(let labelId of labelIds){

  await pool.query(
    "INSERT INTO todo_labels(todo_id,label_id) VALUES($1,$2)",
    [id,labelId]
  )

}

return NextResponse.json({message:"labels added"})

}
