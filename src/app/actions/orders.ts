"use server";

import db from "@/dbs/db";

export async function userOrderExists(email: string, productId: string) {
  return (
    (await db.order.findFirst({
      where: { user: { email }, productId },
      select: { id: true },
    })) != null
  );
}

/// checking if user exists 


