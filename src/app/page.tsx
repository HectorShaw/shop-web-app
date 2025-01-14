import { Button } from "@/components/ui/button";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
const prisma = new PrismaClient();

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Home page</h1>
        <Link href="/admin">
          <Button >
            Admin page
          </Button>
        </Link>
      </div>
    </div>
  );
}
