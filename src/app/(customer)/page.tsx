import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import db from "@/dbs/db";
import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function HomePage() {
  console.log("Hello");
  return (
    <div className="space-y-12">
      <ProducGridSection
        productFetcher={getPopularProduct}
        title="Popular Now"
      />
      <ProducGridSection productFetcher={getNewProduct} title="Fresh Drops" />
    </div>
  );
}

export function getPopularProduct() {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { orders: { _count: "desc" } },
    take: 9,
  });
}

export function getNewProduct() {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: "desc" },
    take: 9,
  });
}

type ProducGridSectionProps = {
  title: string;
  productFetcher: () => Promise<Product[]>;
};

function ProducGridSection({
  productFetcher,
  title,
}: ProducGridSectionProps) {
  return (
    <>
      <div className="space-y-4">
        <div className="flex gap-4">
          <h2 className="text-3xl font-bold">{title}</h2>
          <Button variant="outline" asChild>
            <Link href="/products" className="space-x-2">
              View All
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
        fallback={
        <>
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </>
        }
        >
          <ProductSuspense productFetcher={productFetcher} />
        </Suspense>
      </div>
    </>
  );
}

async function ProductSuspense({
  productFetcher,
}: {
  productFetcher: () => Promise<Product[]>;
}) {
  return (await productFetcher()).map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}
