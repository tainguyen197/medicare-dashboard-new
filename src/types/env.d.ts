import type { R2Bucket, KVNamespace } from "./cloudflare";

declare global {
  interface Env {
    DATABASE_URL: string;
    DATABASE_AUTH_TOKEN: string;
    MEDICARE_BUCKET: R2Bucket;
    SESSION_STORE: KVNamespace;
  }
}

export {};
