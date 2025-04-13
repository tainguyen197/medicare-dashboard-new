export interface R2Bucket {
  head: (key: string) => Promise<R2Object | null>;
  get: (key: string, options?: R2GetOptions) => Promise<R2ObjectBody | null>;
  put: (
    key: string,
    value: ReadableStream | ArrayBuffer | ArrayBufferView | string | null,
    options?: R2PutOptions
  ) => Promise<R2Object>;
  delete: (key: string | string[]) => Promise<void>;
  list: (options?: R2ListOptions) => Promise<R2Objects>;
}

export interface R2Object {
  key: string;
  version: string;
  size: number;
  etag: string;
  httpEtag: string;
  uploaded: Date;
  httpMetadata?: R2HttpMetadata;
  customMetadata?: Record<string, string>;
}

export interface R2ObjectBody extends R2Object {
  body: ReadableStream;
  bodyUsed: boolean;
  arrayBuffer: () => Promise<ArrayBuffer>;
  text: () => Promise<string>;
  json<T>(): Promise<T>;
  blob: () => Promise<Blob>;
}

export interface R2GetOptions {
  onlyIf?: R2Conditional;
  range?: R2Range;
}

export interface R2PutOptions {
  httpMetadata?: R2HttpMetadata;
  customMetadata?: Record<string, string>;
  md5?: ArrayBuffer | string;
  sha1?: ArrayBuffer | string;
  sha256?: ArrayBuffer | string;
  sha384?: ArrayBuffer | string;
  sha512?: ArrayBuffer | string;
}

export interface R2HttpMetadata {
  contentType?: string;
  contentLanguage?: string;
  contentDisposition?: string;
  contentEncoding?: string;
  cacheControl?: string;
  cacheExpiry?: Date;
}

export interface KVNamespace {
  get: (key: string, options?: KVNamespaceGetOptions) => Promise<string | null>;
  getWithMetadata: (
    key: string,
    options?: KVNamespaceGetOptions
  ) => Promise<{
    value: string | null;
    metadata: Record<string, unknown> | null;
  }>;
  put: (
    key: string,
    value: string,
    options?: KVNamespacePutOptions
  ) => Promise<void>;
  delete: (key: string) => Promise<void>;
  list: (options?: KVNamespaceListOptions) => Promise<{
    keys: { name: string; metadata?: Record<string, unknown> }[];
    list_complete: boolean;
    cursor?: string;
  }>;
}

export interface KVNamespaceGetOptions {
  type?: "text" | "json" | "arrayBuffer" | "stream";
  cacheTtl?: number;
}

export interface KVNamespacePutOptions {
  expiration?: number;
  expirationTtl?: number;
  metadata?: Record<string, unknown>;
}

export interface KVNamespaceListOptions {
  prefix?: string;
  limit?: number;
  cursor?: string;
}

// Missing types referenced above but not explicitly defined
// Using type aliases instead of empty interfaces to avoid linter errors
export type R2Conditional = Record<string, unknown>;
export type R2Range =
  | { offset?: number; length?: number }
  | { suffix?: number };
export type R2Objects = {
  objects: R2Object[];
  delimitedPrefixes: string[];
  truncated: boolean;
  cursor?: string;
};
