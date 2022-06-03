import { ActionFunction, fetch, Headers, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import React from "react";

type ActionData = {
  errors?: {
    title?: string;
    description?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");

  if (typeof title !== "string" || title.length === 0) {
    return json<ActionData>({ errors: { title: "Title is required" } }, { status: 400 });
  }

  if (typeof description !== "string" || description.length === 0) {
    return json<ActionData>({ errors: { description: "description is required" } }, { status: 400 });
  }
  
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  await fetch("https://benalloway.azurewebsites.net/items", {
    body: JSON.stringify({ title: title, description: description, statusId: 2 }),
    method: "POST",
    headers: headers
  });

  return redirect(`/todos`);
};

export default function CreateTodo() {
  const actionData = useActionData() as ActionData;
  const titleRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.description) {
      descriptionRef.current?.focus();
    }
  }, [actionData]);

  // const todo: TodoInterface = useLoaderData()
  return (
    <div className="shadow sm:rounded-md sm:overflow-hidden">
      <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
        <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
          <Form method="post">
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
                  <p className="mt-1 text-sm text-gray-500">Use a permanent address where you can recieve mail.</p>
                </div>

                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      aria-invalid={actionData?.errors?.title ? true : undefined}
                      aria-errormessage={actionData?.errors?.title ? "title-error" : undefined}
                      type="text"
                      name="title"
                      id="title"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-6 lg:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      aria-invalid={actionData?.errors?.description ? true : undefined}
                      aria-errormessage={actionData?.errors?.description ? "description-error" : undefined}
                      name="description"
                      id="description"
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Todo
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
