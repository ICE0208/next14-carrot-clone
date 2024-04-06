"use server";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import validator from "validator";

const checkIsEmail = async (
  { email }: { email: string },
  ctx: z.RefinementCtx
) => {
  const isEmail = validator.isEmail(email);
  if (!isEmail) {
    ctx.addIssue({
      code: "custom",
      message: "Invalid email",
      path: ["email"],
      fatal: true,
    });
    return z.NEVER;
  }
};

const checkEmailExist = async (
  { email }: { email: string },
  ctx: z.RefinementCtx
) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  if (!user) {
    ctx.addIssue({
      code: "custom",
      message: "Account with this email does not exist.",
      path: ["email"],
      fatal: true,
    });
    return z.NEVER;
  }
};

const formSchema = z
  .object({
    email: z.string().toLowerCase(),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
  })
  .superRefine(checkIsEmail)
  .superRefine(checkEmailExist);

export const login = async (prevState: any, formData: FormData) => {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    // 비밀번호 확인
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });
    if (!user || !user.password) {
      return {
        fieldErrors: {
          password: ["Please login with social account."],
          email: [],
        },
      };
    }

    const ok = await bcrypt.compare(result.data.password, user.password);

    if (ok) {
      // 비밀번호 ok -> LOGIN
      const session = await getSession();
      session.id = user!.id;
      await session.save();
      redirect("/profile");
    } else {
      // 비밀번호 not ok -> ERROR
      return {
        fieldErrors: {
          password: ["Wrong Password."],
          email: [],
        },
      };
    }
  }
};
