import { treaty } from "@elysiajs/eden";
import type { app } from "../app/api/[[...slugs]]/route";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  return appUrl.startsWith("http") ? appUrl : `http://${appUrl}`;
};

export const client = treaty<app>(getBaseUrl()).api;
