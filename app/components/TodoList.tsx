import { ActionFunction, json } from "@remix-run/node";
import { Form, useSubmit, useTransition, SubmitFunction } from "@remix-run/react";
import fetch from "@remix-run/web-fetch";
import { FormEvent } from "react";
import { TodoInterface } from "~/routes/todos";

interface Data {
  items: Array<{
    id: number;
    title: string;
    description: string;
    statusId: number;
  }>;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

async function handleComplete(updateItem: TodoInterface) {
  updateItem = { ...updateItem, statusId: 2 };
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  await fetch("https://benalloway.azurewebsites.net/items", {
    method: "PUT",
    headers: headers,
    mode: "cors",
    body: JSON.stringify(updateItem),
  });
}

export default function TodoList({ items }: Data) {
  const transition = useTransition();

  const submit = useSubmit();

  function handleSubmit(item: TodoInterface)  {
    const form = new FormData();
    form.set("id", item.id.toString())
    form.set("title", item.title)
    form.set("description", item.description)
    form.set("statusId", item.statusId === 1 ? "2" : "1")
    submit(form, { replace: true, method: "post" });
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Plans</h1>
            <p className="mt-2 text-sm text-gray-700">
              Your team is on the <strong className="font-semibold text-gray-900">Startup</strong> plan. The next payment
              of $80 will be due on August 4, 2022.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Update credit card
            </button>
          </div>
        </div> */}
      <div className="-mx-4 mt-10 ring-1 ring-gray-300 sm:-mx-6 md:mx-0 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Title
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Description
              </th>
              {/* <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Status
                </th> */}
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Status</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: TodoInterface, idx) => {
              const isSubmitting = transition.submission?.formData.get("id") === item.id.toString();

              return (
                <tr onClick={() => handleSubmit(item)} key={item.id} className={item.statusId === 2 ? "line-through text-green-300 hover:bg-gray-50" : "text-gray-500 hover:bg-gray-50"}>
                  <td
                    className={classNames(
                      idx === 0 ? "" : "border-t border-transparent",
                      "relative py-4 pl-4 sm:pl-6 pr-3 text-sm lg:hidden"
                    )}
                  >
                      <div className="font-medium">{item.title}: {item.description}</div>
                    {idx !== 0 ? <div className="absolute right-0 left-6 -top-px h-px bg-gray-200" /> : null}
                  </td>
                  <td
                    className={classNames(
                      idx === 0 ? "" : "border-t border-transparent",
                      "hidden relative py-4 pl-4 sm:pl-6 pr-3 text-sm lg:table-cell"
                    )}
                  >
                    <div className="font-medium">{item.title}</div>
                    {idx !== 0 ? <div className="absolute right-0 left-6 -top-px h-px bg-gray-200" /> : null}
                  </td>
                  <td
                    className={classNames(
                      idx === 0 ? "" : "border-t border-gray-200",
                      "hidden px-3 py-3.5 text-sm lg:table-cell"
                    )}
                  >
                    {item.description}
                  </td>
                  <td
                    className={classNames(
                      idx === 0 ? "" : "border-t border-transparent",
                      "relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-medium"
                    )}
                  >
                    <Form method="post">
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="title" value={item.title} />
                      <input type="hidden" name="description" value={item.description} />
                      {item.statusId === 1 ? (
                        <>
                          <input type="hidden" name="statusId" value="2" />
                          <button
                            type="button"
                            onClick={() => handleSubmit(item)}
                            className="inline-flex items-center rounded-full border border-gray-300 bg-white p-4 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                          ></button>
                        </>
                      ) : item.statusId === 2 ? (
                        <>
                          <input type="hidden" name="statusId" value="1" />
                          <button
                            type="button"
                            onClick={() => handleSubmit(item)}
                            className="inline-flex items-center rounded-full border bg-green-300 p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                          ></button>
                        </>
                      ) : null}
                    </Form>
                    {idx !== 0 ? <div className="absolute right-6 left-0 -top-px h-px bg-gray-200" /> : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
