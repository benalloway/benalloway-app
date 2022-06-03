import { ActionFunction, json } from "@remix-run/node";
import { Link, Outlet, useActionData, useLoaderData } from "@remix-run/react";
import ApplicationShell from "~/components/ApplicationShell";
import TodoList from "~/components/TodoList";

export interface TodoInterface {
  id: number;
  title: string;
  description: string;
  statusId: number;
  isLoading?: boolean;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const statusId = formData.get("statusId");
  const id = formData.get("id");

  if (typeof title !== "string" || title.length === 0) {
    return json({ status: 400 });
  }

  if (typeof description !== "string" || description.length === 0) {
    return json({ status: 400 });
  }

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  await fetch("https://benalloway.azurewebsites.net/items", {
    body: JSON.stringify({ id: id, title: title, description: description, statusId: statusId }),
    method: "PUT",
    headers: headers,
  });

  return json({id: id});
};

export async function loader() {
  const res = await fetch("https://benalloway.azurewebsites.net/items");
  return json(await res.json());
}

export default function TodosPage() {
  const todos: Array<TodoInterface> = useLoaderData();
  
  return (
    <ApplicationShell>
      <>
        {/* <Outlet /> */}
        <TodoList items={todos} />
      </>
    </ApplicationShell>
  );
}
