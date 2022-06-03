import { fetch, json, LoaderFunction } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { useLoaderData } from "@remix-run/react";

import {TodoInterface} from ".";

export const loader: LoaderFunction = async ({
  params,
}) => {
  const res = await fetch("https://benalloway.azurewebsites.net/items/"+params.todoId);
  return json(await res.json());
};

export default function Todo() {
    const todo: TodoInterface = useLoaderData()
    return (<div>{todo.description}</div>)
}