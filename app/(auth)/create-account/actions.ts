"use server";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const checkUsername = (username: string) => {
  return !username.includes("potato");
};

const checkPasswords = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => password === confirmPassword;

const checkUniqueUsername = async (
  { username }: { username: string },
  ctx: z.RefinementCtx
) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });
  if (user) {
    ctx.addIssue({
      code: "custom",
      message: "This username is already taken",
      path: ["username"],
      fatal: true,
    });
    return z.NEVER;
  }
};
const checkUniqueEmail = async (
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
  if (user) {
    ctx.addIssue({
      code: "custom",
      message: "This email is already taken",
      path: ["email"],
      fatal: true,
    });
    return z.NEVER;
  }
};

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string!",
        required_error: "Where is my username???",
      })
      .toLowerCase()
      .trim()
      .refine(checkUsername, "No potato allowed!"),
    email: z.string().email().toLowerCase(),
    password: z.string().min(4).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirmPassword: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .superRefine(checkUniqueUsername)
  .superRefine(checkUniqueEmail)
  .refine(checkPasswords, {
    message: "Both passwords should be the same!",
    path: ["confirmPassword"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("comfirmPassword"),
  };

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    // 비밀번호 해시
    const hashedPassword = await bcrypt.hash(result.data.password, 12);

    // db에 저장
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });

    // 로그인
    const session = await getSession();
    session.id = user.id;
    await session.save();

    // 리다이렉트 to home
    redirect("/profile");
  }
}
