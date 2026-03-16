import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export const PLANS = {
  FREE: {
    name: "Free",
    description: "Get started with basic QR codes",
    price: 0,
    priceId: null,
    limits: {
      qrCodesPerDay: 5,
      aiStyles: false,
      formats: ["png"],
      logoOverlay: false,
      analytics: false,
      bulkGeneration: false,
      apiAccess: false,
      teamAccounts: false,
    },
  },
  PRO: {
    name: "Pro",
    description: "Unlimited QR codes with AI styles",
    price: 9,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    limits: {
      qrCodesPerDay: Infinity,
      aiStyles: true,
      formats: ["png", "svg", "pdf"],
      logoOverlay: true,
      analytics: true,
      bulkGeneration: false,
      apiAccess: false,
      teamAccounts: false,
    },
  },
  BUSINESS: {
    name: "Business",
    description: "Everything for teams and enterprises",
    price: 29,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID,
    limits: {
      qrCodesPerDay: Infinity,
      aiStyles: true,
      formats: ["png", "svg", "pdf"],
      logoOverlay: true,
      analytics: true,
      bulkGeneration: true,
      apiAccess: true,
      teamAccounts: true,
    },
  },
} as const;

export type PlanKey = keyof typeof PLANS;
