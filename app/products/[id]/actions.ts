"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

export const deleteProduct = async (productId: number) => {
  const session = await getSession();
  if (!session) {
    // 권한이 없음
    console.log("권한이 없음");
    return;
  }

  try {
    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        userId: true,
      },
    });
    if (!product) {
      console.log("해당 아이디의 product 없음");
      return;
    }

    const productOwnerId = product.userId;
    if (productOwnerId !== session.id) {
      console.log("권한이 없음");
      return;
    }

    // product를 db에서 삭제
    await db.product.delete({
      where: {
        id: productId,
      },
    });
  } catch (e) {
    // db 수정 중 에러 발생
    console.log(e);
    console.log("db 수정 중 에러 발생");
    return;
  }

  return redirect("/products");
};
