

import db from "@/dbs/db";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import { CheckoutForm } from "./_components/CheckoutForm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function purchasePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const product = await db.product.findUnique({
    where: { id },
  });
  if (product == null) return notFound();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    currency: "usd",
    metadata: { product: product.id },
  });

  // console.log(paymentIntent);

  if (paymentIntent.client_secret == null) {
    throw Error("Stripe failed to create payment intent");
  }

  return (
    <CheckoutForm
      product = {product}
      clientSecret={paymentIntent.client_secret}
    />

  );
}
