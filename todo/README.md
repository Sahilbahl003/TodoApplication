You have 3 different problems here. I’ll fix them one by one so your subtasks will:
✅ fetch correctly
✅ save with todo_id
✅ save user_id
✅ save subtask_date
✅ update correctly
Right now your issues are mostly SQL mistakes + missing fields in INSERT + missing auth filtering.
1️⃣ Fix Your Database Rows First
Your table shows this:

id | todo_id | title | completed | subtask_date | user_id
----+---------+-------+-----------+--------------+--------
 1 | NULL | dadad
 2 | NULL | adadad
Those rows were inserted without todo_id.
Delete them:
SQL
DELETE FROM subtasks WHERE todo_id IS NULL;
2️⃣ Fix Your POST API (Major Problem)
Your current query:
SQL
INSERT INTO subtasks(todo_id,title)
VALUES($1,$2)
But your table has:

todo_id
title
completed
subtask_date
user_id
You must insert user_id and subtask_date.
Correct API
📁 /api/todos/[id]/subtasks/route.js
JavaScript
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "../../../../../../lib/db";

export async function POST(req,{params}){

const token = req.headers.get("authorization")?.split(" ")[1]
const decoded = jwt.verify(token,process.env.JWT_SECRET)

const {id} = params
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
Fix GET Query (You Had SQL Syntax Error)
Your code:
SQL
SELECT * FROM subtasksWHERE todo_id=$1ORDER BY id
There are missing spaces.
Correct Query
JavaScript
export async function GET(req,{params}){

const {id} = params

const result = await pool.query(
`SELECT * FROM subtasks
WHERE todo_id=$1
ORDER BY id`,
[id]
)

return NextResponse.json(result.rows)

}
 Secure GET with User ID (Recommended)
Otherwise users could see others' subtasks.
JavaScript
export async function GET(req,{params}){

const token = req.headers.get("authorization")?.split(" ")[1]
const decoded = jwt.verify(token,process.env.JWT_SECRET)

const {id} = params

const result = await pool.query(
`SELECT * FROM subtasks
WHERE todo_id=$1 AND user_id=$2
ORDER BY id`,
[id,decoded.id]
)

return NextResponse.json(result.rows)

}
 Fix PUT (Update Subtask)
You should also check user_id.
JavaScript
import { NextResponse } from "next/server";
import pool from "../../../../lib/db";
import jwt from "jsonwebtoken";

export async function PUT(req,{params}){

const token = req.headers.get("authorization")?.split(" ")[1]
const decoded = jwt.verify(token,process.env.JWT_SECRET)

const {id} = params
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

Fix DELETE
JavaScript

export async function DELETE(req,{params}){

const token = req.headers.get("authorization")?.split(" ")[1]
const decoded = jwt.verify(token,process.env.JWT_SECRET)

const {id} = params

await pool.query(
`DELETE FROM subtasks
WHERE id=$1 AND user_id=$2`,
[id,decoded.id]
)

return NextResponse.json({message:"Deleted"})

}
 Small Fix in Your React Code
You accidentally used links inside JSX.
Wrong:
JSX
router.push(`/todo/edit/${[todo.id](http://todo.id/)}`)
Correct:
JSX
router.push(`/todo/edit/${todo.id}`)
Wrong:
JSX
key={[sub.id](http://sub.id/)}
Correct:
JSX
key={sub.id}
8️⃣ Add Checkbox Toggle (Update Subtask)
Add this function in your component:
JavaScript
async function toggleSubtask(id,completed){

const token = localStorage.getItem("token")

await fetch(`/api/subtasks/${id}`,{
method:"PUT",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify({completed:!completed})
})

setSubtasks(prev =>
prev.map(s =>
s.id === id ? {...s,completed:!completed} : s
)
)

}
Then update checkbox:
JSX
<input
type="checkbox"
checked={sub.completed}
onChange={()=>toggleSubtask(sub.id,sub.completed)}
/>
9️⃣ Final Working Flow
Create subtask

POST /api/todos/:id/subtasks
Get subtasks

GET /api/todos/:id/subtasks
Toggle

PUT /api/subtasks/:id
Delete

DELETE /api/subtasks/:id
🔥 Important Suggestion (Real App Level)
Instead of separate queries, you can join subtasks directly in todo detail.
Example:
SQL
SELECT
t.*,
COALESCE(
json_agg(
json_build_object(
'id',s.id,
'title',s.title,
'completed',s.completed
)
) FILTER (WHERE s.id IS NOT NULL),'[]'
) as subtasks
FROM todos t
LEFT JOIN subtasks s ON t.id=s.todo_id
WHERE t.id=$1
GROUP BY t.id
This returns todo + subtasks in one API call (faster like Todoist).
If you want, I can also show you 3 powerful Todo features used by Todoist that will make your project look like a real production app (drag reorder, progress %, keyboard shortcuts).