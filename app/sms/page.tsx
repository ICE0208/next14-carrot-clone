"use client";

import FormInput from "@/components/input";
import Button from "@/components/button";
import { smsVerification } from "./actions";
import { useFormState } from "react-dom";

export default function SMSLogin() {
  const [state, dispatch] = useFormState(smsVerification, null);

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
        <FormInput
          name="phone"
          type="number"
          placeholder="Phone number"
          required
        />
        <FormInput
          name="token"
          type="number"
          placeholder="Verification Code"
          required
        />
        <Button text="Verify" />
      </form>
    </div>
  );
}
