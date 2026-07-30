import fs from 'node:fs';
import path from 'node:path';
import { randomBytes, randomUUID } from 'node:crypto';
import matter from 'gray-matter';

export type AccessCodeRecord = {
  id: string;
  code: string;
  label: string;
  active: boolean;
  createdAt: string;
  lastUsedAt: string | null;
  responseCount: number;
};

export type ResponseRecord = {
  responseId: string;
  accessCodeId: string;
  createdAt: string;
  updatedAt: string;
  answers?: Record<string, string | number | null>;
  name?: string;
};

type StoreShape = {
  responses: ResponseRecord[];
};

const RESPONSES_PATH = path.join(process.cwd(), 'data', 'discover-your-capacity.json');
const ACCESS_CODES_DIR = path.join(process.cwd(), 'content', 'discover-capacity-codes');

function defaultStore(): StoreShape {
  return { responses: [] };
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function readResponsesStore(): StoreShape {
  try {
    if (!fs.existsSync(RESPONSES_PATH)) return defaultStore();
    return JSON.parse(fs.readFileSync(RESPONSES_PATH, 'utf8')) as StoreShape;
  } catch {
    return defaultStore();
  }
}

function writeResponsesStore(store: StoreShape) {
  ensureDir(path.dirname(RESPONSES_PATH));
  fs.writeFileSync(RESPONSES_PATH, `${JSON.stringify(store, null, 2)}\n`);
}

function codePath(id: string) {
  return path.join(ACCESS_CODES_DIR, `${id}.md`);
}

function readAccessCodeFile(filePath: string): AccessCodeRecord | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(raw);
    const frontmatter = parsed.data as Partial<AccessCodeRecord>;
    return {
      id: frontmatter.id || path.basename(filePath, '.md'),
      code: frontmatter.code || '',
      label: frontmatter.label || 'Untitled access code',
      active: frontmatter.active ?? true,
      createdAt: frontmatter.createdAt || new Date().toISOString(),
      lastUsedAt: frontmatter.lastUsedAt ?? null,
      responseCount: frontmatter.responseCount || 0,
    };
  } catch {
    return null;
  }
}

function writeAccessCodeFile(record: AccessCodeRecord) {
  ensureDir(ACCESS_CODES_DIR);
  const body = matter.stringify('', record);
  fs.writeFileSync(codePath(record.id), body);
}

function listAccessCodes(): AccessCodeRecord[] {
  try {
    if (!fs.existsSync(ACCESS_CODES_DIR)) return [];
    return fs
      .readdirSync(ACCESS_CODES_DIR)
      .filter((file) => file.endsWith('.md'))
      .map((file) => readAccessCodeFile(path.join(ACCESS_CODES_DIR, file)))
      .filter((item): item is AccessCodeRecord => item !== null)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

function seedIfNeeded() {
  const seed = process.env.DISCOVER_CAPACITY_ACCESS_CODE?.trim();
  if (!seed) return;
  if (listAccessCodes().length > 0) return;
  const record: AccessCodeRecord = {
    id: randomUUID(),
    code: seed,
    label: 'Seed access code',
    active: true,
    createdAt: new Date().toISOString(),
    lastUsedAt: null,
    responseCount: 0,
  };
  writeAccessCodeFile(record);
}

seedIfNeeded();

export function readStore(): { accessCodes: AccessCodeRecord[]; responses: ResponseRecord[] } {
  return { accessCodes: listAccessCodes(), responses: readResponsesStore().responses };
}

export function writeStore(store: { accessCodes: AccessCodeRecord[]; responses: ResponseRecord[] }) {
  writeResponsesStore({ responses: store.responses });
  ensureDir(ACCESS_CODES_DIR);
  for (const record of store.accessCodes) {
    writeAccessCodeFile(record);
  }
}

export function createAccessCode(label: string) {
  const record: AccessCodeRecord = {
    id: randomUUID(),
    code: randomBytes(3).toString('hex').toUpperCase(),
    label: label.trim() || 'Untitled access code',
    active: true,
    createdAt: new Date().toISOString(),
    lastUsedAt: null,
    responseCount: 0,
  };
  writeAccessCodeFile(record);
  return record;
}

export function deleteAccessCode(id: string) {
  const filePath = codePath(id);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  const store = readResponsesStore();
  store.responses = store.responses.filter((response) => response.accessCodeId !== id);
  writeResponsesStore(store);
  return true;
}

export function setAccessCodeActive(id: string, active: boolean) {
  const record = listAccessCodes().find((item) => item.id === id);
  if (!record) return null;
  record.active = active;
  writeAccessCodeFile(record);
  return record;
}

export function issueResponse(accessCodeId: string) {
  const accessCode = listAccessCodes().find((item) => item.id === accessCodeId && item.active);
  if (!accessCode) return null;

  const response: ResponseRecord = {
    responseId: randomUUID(),
    accessCodeId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  accessCode.lastUsedAt = response.createdAt;
  accessCode.responseCount += 1;
  writeAccessCodeFile(accessCode);

  const store = readResponsesStore();
  store.responses.unshift(response);
  writeResponsesStore(store);
  return response;
}

export function updateResponse(responseId: string, patch: Partial<ResponseRecord>) {
  const store = readResponsesStore();
  const response = store.responses.find((item) => item.responseId === responseId);
  if (!response) return null;
  Object.assign(response, patch, { updatedAt: new Date().toISOString() });
  writeResponsesStore(store);
  return response;
}

export function deleteResponse(responseId: string) {
  const store = readResponsesStore();
  const index = store.responses.findIndex((item) => item.responseId === responseId);
  if (index < 0) return false;
  store.responses.splice(index, 1);
  writeResponsesStore(store);
  return true;
}

export function verifyAccessCode(code: string) {
  const normalized = code.trim();
  return listAccessCodes().find((item) => item.active && item.code === normalized) || null;
}

export function getStore() {
  return readStore();
}
