import db from "@/lib/db";
import getSession from "@/lib/session";
import Image from "next/image";
import { notFound } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";
import { formatToWon } from "@/lib/utils";
import Link from "next/link";
import { deleteProduct } from "./actions";

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const productId = Number(params.id);
  if (isNaN(productId)) {
    return notFound();
  }
  const product = await getProduct(productId);
  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.userId);

  const deleteProductWithId = deleteProduct.bind(null, productId);

  return (
    <div className="pb-32">
      <div className="relative aspect-square w-full h-80">
        <Image
          fill
          src={product.photo}
          alt={product.title}
          className="object-cover"
        />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 rounded-full overflow-hidden">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              width={40}
              height={40}
              alt={product.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-xl">
          {formatToWon(product.price)}원
        </span>
        {isOwner ? (
          <form action={deleteProductWithId}>
            <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
              Delete product
            </button>
          </form>
        ) : null}
        <Link
          className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
          href={``}
        >
          채팅하기
        </Link>
      </div>
    </div>
  );
}
