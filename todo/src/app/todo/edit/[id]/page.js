import TodoForm from "@/app/components/TodoForm";

async function getTodo(id) {
  const res = await fetch(`http://localhost:3000/api/todos/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function Page({ params }) {

  const { id } = await params;   // ✅ FIX

  const todo = await getTodo(id);

  return <TodoForm todo={todo} />;
}