import db from "@/dbs/db";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";

export async function GET(
  req: NextRequest,
  {
    params: { downloadVerificationId },
  }: { params: { downloadVerificationId: string } }
) {
  
  const data = await db.downloadVerification.findUnique({
    where: { id: downloadVerificationId, expiresAt: { gt: new Date() } },
    select: { product: { select: { filePath: true, name: true } } },
  });

  if (data == null) {
    return NextResponse.redirect(new URL("/products/downloads/expired", req.url))
  }  

   const { size } = await fs.stat(data.product.filePath);
    const file = await fs.readFile(data.product.filePath);
    const extention = data.product.filePath.split(".").pop();
  
    return new NextResponse(file, {
      headers: {
        "Content-Type": `application/${extention}`,
        "Content-Length": size.toString(),
        "Content-Disposition": `attachment; filename=${data.product.name}.${extention}`,
      },
    });
}
