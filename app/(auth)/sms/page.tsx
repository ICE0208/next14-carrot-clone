"use client";

import Input from "@/components/input";
import Button from "@/components/button";
import { smsLogin } from "./actions";
import { useFormState } from "react-dom";

const initialState = {
  token: false,
  error: undefined,
};

export default function SMSLogin() {
  const [state, dispatch] = useFormState(smsLogin, initialState);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number.</h2>
      </div>
      <form
        action={dispatch}
        className="flex flex-col gap-3"
      >
        {state.token ? (
          <Input
            key="token"
            name="token"
            type="number"
            placeholder="Verification Code"
            min={100000}
            max={999999}
            errors={state.error?.formErrors}
            required
          />
        ) : (
          <Input
            key="phone"
            name="phone"
            type="text"
            placeholder="Phone number"
            required
            errors={state.error?.formErrors}
          />
        )}
        <Button text={state.token ? "Verify Token" : "Send Verification SMS"} />
      </form>
    </div>
  );
}