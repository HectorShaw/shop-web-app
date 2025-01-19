import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import db from "@/dbs/db";
import { Product } from "@prisma/client";
import { get } from "http";
import { Suspense } from "react";

function getProducts() {
  return db.product.findMany({ 
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: "asc" },    
});
}

export default function ProductPage() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspense />
        </Suspense>
      </div>
    </>
  );
}

async function ProductSuspense() {
  const products = await getProducts();

  return products.map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}
