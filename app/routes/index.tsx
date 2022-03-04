import {Form, useActionData} from "@remix-run/react";
import {json, LoaderFunction} from "remix";
import { Rcon } from "rcon-client"

const badRequest = (data: ActionData) =>
  json(data, { status: 400 });

type ActionData = {
  formError?: string
  created?: boolean
  fieldErrors?: {
    key?: string | undefined
    username?: string | undefined
    password?: string | undefined
  }
  fields?: {
    key?: string
    username?: string
    password?: string
  }
}

function validateKey(key: string) {
  if (key!==process.env.AUTH_KEY) return "Invalid auth key!"
}

function validatePassword(pass: string) {
  console.log("Do we call?", pass.length)
  if (pass.length<5) return "Must be at least five characters"
}

export const action: LoaderFunction = async ({request}) => {
  const body = await request.formData()
  const key = body.get("key")
  const username = body.get("username")
  const password = body.get("password")
  if (
    typeof key !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    return badRequest({
      formError: "Form submitted incorrectly"
    })
  }
  const fieldErrors = {
    key: validateKey(key),
    password: validatePassword(password)
  }
  const fields = {key, username, password}
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }
  try {
    const rconPass = process.env.RCON_SECRET
    if(!rconPass) throw new Error("misconfigured server")
    const rcon = await Rcon.connect({
      host: "mc.dov.dev", port: 25575, password: rconPass
    })
    const result = await rcon.send(`authme register ${username} ${password}`)
    console.log(result)
  } catch (e) {
    return badRequest({formError: "User creation failed"})
  }
  return json({created: true})
}
export default function Index() {
  const actionData = useActionData<ActionData>();
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
        hi! 👋
      </h1>
      <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
        Register for the mc.dov.dev Minecraft server!
      </h1>
      <div className="pb-0.5 md:pb-8 flex flex-col md:flex-row">
        <div className="pt-8 rounded-2xl basis-3/4">
          <h2>If you weren't given an auth key then you're in the wrong place! Sorry.</h2>
        </div>
        <div className="aboutContent pt-8 md:px-8 homepageText space-y-5 basis-3/4">
          <h1>Register</h1>
          <Form method="post" className="mt-5">
            <label className="uppercase text-sm font-bold opacity-70">Invite key</label>
            <input type="text"
                   name="key"
                   className="p-3 w-full bg-slate-200 dark:bg-gray-700 rounded border-2 border-slate-200 dark:border-gray-400 focus:border-slate-600 focus:outline-none"/>
            {actionData?.fieldErrors?.key? (
              <p
                className="mt-0 text-red-700 italic"
                role="alert"
                id="key-error"
              >
                {actionData.fieldErrors.key}
              </p>
            ) : null}
            <label className="uppercase text-sm font-bold opacity-70">Minecraft username (case senstive) </label>
            <input type="text"
                   name="username"
                   className="p-3 w-full bg-slate-200 dark:bg-gray-700 rounded border-2 border-slate-200 dark:border-gray-400 focus:border-slate-600 focus:outline-none"/>
            {actionData?.fieldErrors?.username? (
              <p
                className="mt-0 text-red-700 italic"
                role="alert"
                id="key-error"
              >
                {actionData.fieldErrors.username}
              </p>
            ) : null}
            <label className="uppercase text-sm font-bold opacity-70">Password</label>
            <input type="password"
                   name="password"
                   className="p-3 w-full bg-slate-200 dark:bg-gray-700 rounded border-2 border-slate-200 dark:border-gray-400 focus:border-slate-600 focus:outline-none"/>
            {actionData?.fieldErrors?.password? (
              <p
                className="mt-0 text-red-700 italic"
                role="alert"
                id="key-error"
              >
                {actionData.fieldErrors.password}
              </p>
            ) : null}
            <input type="submit"
                   className="py-3 px-6 my-2 bg-slate-700 dark:bg-slate-900 text-white font-medium rounded hover:bg-indigo-500 cursor-pointer ease-in-out duration-300"
                   value="Register"/>
            {actionData?.formError? (
              <p
                className="mt-0 text-red-700 italic"
                role="alert"
                id="key-error"
              >
                {actionData.formError}
              </p>
            ) : null}
            {actionData?.created? (
              <p
                className="mt-0 text-green-700 font-bold"
              >
                User created! When you connect to the server, type: /login <i>yourpassword</i>
              </p>
            ) : null}
          </Form>
        </div>
      </div>
    </div>
  );
}
