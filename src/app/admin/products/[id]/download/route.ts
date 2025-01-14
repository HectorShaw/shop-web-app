import { NextRequest, NextResponse } from "next/server";
import db from "@/dbs/db";
import fs from "fs/promises";

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const data = await db.product.findUnique({
    where: { id },
    select: { filePath: true, name: true },
  });

  if (data == null) return { status: 404, body: { error: "Not Found" } };

  const { size } = await fs.stat(data.filePath);
  const file = await fs.readFile(data.filePath);
  const extention = data.filePath.split(".").pop();

  return new NextResponse(file, {
    headers: {
      "Content-Type": `application/${extention}`,
      "Content-Length": size.toString(),
      "Content-Disposition": `attachment; filename=${data.name}.${extention}`,
    },
  });
}
