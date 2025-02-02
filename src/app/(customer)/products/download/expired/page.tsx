import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <h1 className="text-4xl mb-4">Expired "Download" Link</h1>
      <Button asChild size="lg">
        <Link href="/orders">Get a New Link</Link>
      </Button>
    </>
  );
}
