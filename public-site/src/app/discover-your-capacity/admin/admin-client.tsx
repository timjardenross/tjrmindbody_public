'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type AccessCodeRecord = {
  id: string;
  code: string;
  label: string;
  active: boolean;
  createdAt: string;
  lastUsedAt: string | null;
  responseCount: number;
};

type ResponseRecord = {
  responseId: string;
  accessCodeId: string;
  createdAt: string;
  updatedAt: string;
  name?: string;
  answers?: Record<string, string | number | null>;
};

const ADMIN_KEY = 'revs-discover-your-capacity-admin-token';

export default function DiscoverCapacityAdmin() {
  const [token, setToken] = useState('');
  const [ready, setReady] = useState(false);
  const [accessCodes, setAccessCodes] = useState<AccessCodeRecord[]>([]);
  const [responses, setResponses] = useState<ResponseRecord[]>([]);
  const [label, setLabel] = useState('');
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);

  const load = useCallback(
    async (adminToken: string = token) => {
      const response = await fetch('/api/discover-your-capacity/admin', {
        headers: { 'x-discover-admin-token': adminToken },
      });
      const data = (await response.json()) as {
        ok?: boolean;
        accessCodes?: AccessCodeRecord[];
        responses?: ResponseRecord[];
        error?: string;
      };
      if (!response.ok || !data.ok) {
        setStatus(data.error || 'Unable to load admin data.');
        return;
      }
      setAccessCodes(data.accessCodes || []);
      setResponses(data.responses || []);
      setStatus(`Loaded ${data.accessCodes?.length || 0} codes and ${data.responses?.length || 0} responses`);
    },
    [token]
  );

  useEffect(() => {
    const saved = window.sessionStorage.getItem(ADMIN_KEY);
    if (saved) {
      setToken(saved);
      load(saved);
    }
    setReady(true);
  }, [load]);

  async function submitToken() {
    window.sessionStorage.setItem(ADMIN_KEY, token);
    await load(token);
  }

  async function createCode() {
    const response = await fetch('/api/discover-your-capacity/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-discover-admin-token': token,
      },
      body: JSON.stringify({ action: 'create', label }),
    });
    if (!response.ok) {
      setStatus('Unable to create code.');
      return;
    }
    setLabel('');
    await load();
  }

  async function toggleCode(id: string, active: boolean) {
    await fetch('/api/discover-your-capacity/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-discover-admin-token': token,
      },
      body: JSON.stringify({ action: 'toggle', id, active }),
    });
    await load();
  }

  async function deleteCode(id: string) {
    if (!confirm('Delete this access code and its linked responses?')) return;
    await fetch('/api/discover-your-capacity/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-discover-admin-token': token,
      },
      body: JSON.stringify({ action: 'delete-code', id }),
    });
    await load();
  }

  async function deleteResponse(id: string) {
    if (!confirm('Delete this response?')) return;
    await fetch('/api/discover-your-capacity/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-discover-admin-token': token,
      },
      body: JSON.stringify({ action: 'delete-response', id }),
    });
    await load();
  }

  const filteredCodes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return accessCodes.filter((code) => {
      const matchesQuery =
        !q || [code.label, code.code, code.id].some((field) => field.toLowerCase().includes(q));
      const matchesActive = !activeOnly || code.active;
      return matchesQuery && matchesActive;
    });
  }, [accessCodes, activeOnly, query]);

  const filteredResponses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return responses.filter((response) => {
      const linkedCode = accessCodes.find((code) => code.id === response.accessCodeId);
      const matchesQuery =
        !q ||
        [response.responseId, response.accessCodeId, response.name || '', linkedCode?.label || '', linkedCode?.code || ''].some(
          (field) => field.toLowerCase().includes(q)
        );
      return matchesQuery;
    });
  }, [accessCodes, query, responses]);

  const stats = useMemo(() => {
    const activeCount = accessCodes.filter((code) => code.active).length;
    const usedCount = accessCodes.filter((code) => code.responseCount > 0).length;
    const totalResponses = responses.length;
    return { activeCount, usedCount, totalResponses };
  }, [accessCodes, responses]);

  function exportResponses() {
    const rows = [
      ['responseId', 'accessCode', 'label', 'name', 'createdAt', 'updatedAt', 'answers'],
      ...filteredResponses.map((response) => {
        const code = accessCodes.find((item) => item.id === response.accessCodeId);
        return [
          response.responseId,
          response.accessCodeId,
          code?.code || '',
          response.name || '',
          response.createdAt,
          response.updatedAt,
          response.answers ? JSON.stringify(response.answers) : '',
        ];
      }),
    ];
    const csv = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'discover-your-capacity-responses.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!ready) return null;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h1 className="text-2xl font-semibold">Discover Your Capacity Admin</h1>
          <p className="mt-2 text-sm text-slate-400">Manage access codes, responses, exports and basic stats.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Admin token"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
            />
            <button onClick={submitToken} className="rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950">
              Unlock
            </button>
          </div>
          <div className="mt-3 text-sm text-slate-400">{status}</div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard label="Active codes" value={stats.activeCount} />
          <StatCard label="Codes used" value={stats.usedCount} />
          <StatCard label="Total responses" value={stats.totalResponses} />
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="New access code label"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
              />
              <button onClick={createCode} className="rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950">
                Generate code
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportResponses}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 font-semibold text-slate-100"
              >
                Export CSV
              </button>
              <button
                onClick={() => setActiveOnly((current) => !current)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 font-semibold text-slate-100"
              >
                {activeOnly ? 'Showing active only' : 'Show active only'}
              </button>
            </div>
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search codes, names, response IDs"
            className="mt-4 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Access codes</h2>
            <div className="mt-4 space-y-3">
              {filteredCodes.map((code) => (
                <div key={code.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="font-semibold">{code.label}</div>
                      <div className="font-mono text-sm text-slate-400">{code.code}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {code.responseCount} responses • last used {code.lastUsedAt || 'never'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleCode(code.id, !code.active)}
                        className="rounded-full border border-slate-700 px-3 py-1 text-sm"
                      >
                        {code.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => deleteCode(code.id)}
                        className="rounded-full border border-rose-800 px-3 py-1 text-sm text-rose-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Response sessions</h2>
            <div className="mt-4 space-y-3">
              {filteredResponses.map((response) => {
                const linkedCode = accessCodes.find((item) => item.id === response.accessCodeId);
                return (
                  <div key={response.responseId} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="font-mono text-sm">{response.responseId}</div>
                        <div className="mt-1 text-sm text-slate-300">
                          {linkedCode?.label || 'Unknown code'} • {linkedCode?.code || response.accessCodeId}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {response.name ? `Name: ${response.name} • ` : ''}
                          created {response.createdAt}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteResponse(response.responseId)}
                        className="rounded-full border border-rose-800 px-3 py-1 text-sm text-rose-300"
                      >
                        Delete
                      </button>
                    </div>
                    {response.answers ? (
                      <details className="mt-3 text-sm text-slate-300">
                        <summary className="cursor-pointer text-slate-400">View answers</summary>
                        <pre className="mt-2 overflow-auto rounded-2xl bg-slate-900 p-3 text-xs text-slate-200">
                          {JSON.stringify(response.answers, null, 2)}
                        </pre>
                      </details>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-white">{value}</div>
    </div>
  );
}
