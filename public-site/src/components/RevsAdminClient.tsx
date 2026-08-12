'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { revsAssessmentSystems } from '@/lib/revs';

type InviteRecord = {
  id: number;
  code: string;
  label: string;
  active: boolean;
  uses_remaining: number | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

type ConceptRecord = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  stage: string;
  status: string;
  sort_order: number;
  principles: string[];
  audience_framings: string[];
  formats: string[];
  depths: string[];
  prerequisites: string[];
  pairs_with: string[];
  evidence: string[];
  accessibility_notes: string[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type VariantRecord = {
  id: number;
  concept_id: number;
  variant_key: string;
  audience: string;
  format: string;
  depth: string;
  stage: string;
  status: string;
  body: string;
  notes: string;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

const emptyList = '';
const toLines = (values: string[]) => values.join('\n');
const fromLines = (value: string) => value.split('\n').map((line) => line.trim()).filter(Boolean);
const conceptFields = [
  { label: 'Principles', placeholder: 'One principle per line', valueKey: 'principles' },
  { label: 'Audience framings', placeholder: 'Primary audience framing lines', valueKey: 'audienceFramings' },
  { label: 'Formats', placeholder: 'One format per line', valueKey: 'conceptFormats' },
  { label: 'Depths', placeholder: 'One depth per line', valueKey: 'conceptDepths' },
  { label: 'Prerequisites', placeholder: 'One prerequisite per line', valueKey: 'conceptPrerequisites' },
  { label: 'Pairs with', placeholder: 'One related concept per line', valueKey: 'pairsWith' },
  { label: 'Evidence', placeholder: 'One evidence note per line', valueKey: 'evidence' },
  { label: 'Accessibility notes', placeholder: 'One accessibility note per line', valueKey: 'accessibilityNotes' },
] as const;

const TOKEN_KEY = 'revs-admin-token';

function principlesForStage(stage: string) {
  if (stage === 'Recognise') return ['capacity over deficit', 'low cognitive load'];
  if (stage === 'Regulate') return ['sustainability over heroism', 'autonomy and agency'];
  if (stage === 'Rebuild') return ['practical and specific', 'authenticity over masking'];
  return ['honour lived experience', 'autonomy and agency'];
}

export function RevsAdminClient() {
  const [token, setToken] = useState('');
  const [ready, setReady] = useState(false);
  const [invites, setInvites] = useState<InviteRecord[]>([]);
  const [code, setCode] = useState('');
  const [label, setLabel] = useState('First cohort');
  const [usesRemaining, setUsesRemaining] = useState('50');
  const [expiresAt, setExpiresAt] = useState('');
  const [allowlistEmail, setAllowlistEmail] = useState('');
  const [allowlistLabel, setAllowlistLabel] = useState('');
  const [concepts, setConcepts] = useState<ConceptRecord[]>([]);
  const [selectedConceptId, setSelectedConceptId] = useState<number | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [variants, setVariants] = useState<VariantRecord[]>([]);
  const [conceptSlug, setConceptSlug] = useState('');
  const [conceptTitle, setConceptTitle] = useState('');
  const [conceptSummary, setConceptSummary] = useState('');
  const [conceptStage, setConceptStage] = useState('Recognise');
  const [conceptStatus, setConceptStatus] = useState('draft');
  const [conceptSortOrder, setConceptSortOrder] = useState('0');
  const [conceptPrinciples, setConceptPrinciples] = useState(emptyList);
  const [audienceFramings, setAudienceFramings] = useState(emptyList);
  const [conceptFormats, setConceptFormats] = useState(emptyList);
  const [conceptDepths, setConceptDepths] = useState(emptyList);
  const [conceptPrerequisites, setConceptPrerequisites] = useState(emptyList);
  const [pairsWith, setPairsWith] = useState(emptyList);
  const [evidence, setEvidence] = useState(emptyList);
  const [accessibilityNotes, setAccessibilityNotes] = useState(emptyList);
  const [variantKey, setVariantKey] = useState('');
  const [variantAudience, setVariantAudience] = useState('Individual');
  const [variantFormat, setVariantFormat] = useState('Article');
  const [variantDepth, setVariantDepth] = useState('5-minute');
  const [variantStage, setVariantStage] = useState('Recognise');
  const [variantStatus, setVariantStatus] = useState('draft');
  const [variantBody, setVariantBody] = useState('');
  const [variantNotes, setVariantNotes] = useState('');
  const [variantSortOrder, setVariantSortOrder] = useState('0');
  const [status, setStatus] = useState('');
  const [copiedCode, setCopiedCode] = useState('');

  const loadInvites = useCallback(
    async (adminToken: string = token) => {
      const response = await fetch('/api/revs/admin/invites', {
        headers: { 'x-revs-admin-token': adminToken },
      });
      const data = (await response.json()) as { ok?: boolean; invites?: InviteRecord[]; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Unable to load invites.');
      }
      setInvites(data.invites || []);
      setStatus(`Loaded ${data.invites?.length || 0} invites`);
    },
    [token]
  );

  const loadConcepts = useCallback(
    async (adminToken: string = token) => {
      const response = await fetch('/api/revs/admin/concepts', {
        headers: { 'x-revs-admin-token': adminToken },
      });
      const data = (await response.json()) as { ok?: boolean; concepts?: ConceptRecord[]; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Unable to load concepts.');
      }
      setConcepts(data.concepts || []);
    },
    [token]
  );

  const loadVariants = useCallback(
    async (conceptId: number, adminToken: string = token) => {
      const response = await fetch(`/api/revs/admin/concepts?conceptId=${conceptId}`, {
        headers: { 'x-revs-admin-token': adminToken },
      });
      const data = (await response.json()) as { ok?: boolean; variants?: VariantRecord[]; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Unable to load variants.');
      }
      setVariants(data.variants || []);
    },
    [token]
  );

  useEffect(() => {
    const saved = window.sessionStorage.getItem(TOKEN_KEY);
    if (saved) {
      setToken(saved);
      loadInvites(saved).catch((error: Error) => setStatus(error.message));
      loadConcepts(saved).catch((error: Error) => setStatus(error.message));
    }
    setReady(true);
  }, [loadInvites, loadConcepts]);

  async function unlock() {
    window.sessionStorage.setItem(TOKEN_KEY, token);
    try {
      await loadInvites(token);
      await loadConcepts(token);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to load invites.');
    }
  }

  async function createInvite() {
    try {
      const response = await fetch('/api/revs/admin/invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-revs-admin-token': token,
        },
        body: JSON.stringify({
          code,
          label,
          usesRemaining: usesRemaining.trim() ? Number(usesRemaining) : null,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Unable to create invite.');
      }
      setCode('');
      setExpiresAt('');
      await loadInvites();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to create invite.');
    }
  }

  async function createStarterInvite() {
    setCode('REVS-001');
    setLabel('First cohort');
    setUsesRemaining('50');
    setExpiresAt('');
    await createInvite();
  }

  async function toggleInvite(invite: InviteRecord) {
    const response = await fetch('/api/revs/admin/invites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revs-admin-token': token,
      },
      body: JSON.stringify({ action: 'toggle', id: invite.id, active: !invite.active }),
    });
    const data = (await response.json()) as { ok?: boolean; error?: string };
    if (!response.ok || !data.ok) {
      setStatus(data.error || 'Unable to update invite.');
      return;
    }
    await loadInvites();
  }

  async function copyInviteCode(codeToCopy: string) {
    await navigator.clipboard.writeText(codeToCopy);
    setCopiedCode(codeToCopy);
    setStatus(`Copied ${codeToCopy}`);
  }

  async function createAllowlistEntry() {
    try {
      const response = await fetch('/api/revs/admin/invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-revs-admin-token': token,
        },
        body: JSON.stringify({
          allowlistEmail,
          allowlistLabel,
        }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Unable to add allowlist entry.');
      }
      setAllowlistEmail('');
      setAllowlistLabel('');
      setStatus('Allowlist entry saved.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to add allowlist entry.');
    }
  }

  async function saveConcept() {
    try {
      const response = await fetch('/api/revs/admin/concepts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-revs-admin-token': token,
        },
        body: JSON.stringify({
          slug: conceptSlug,
          title: conceptTitle,
          summary: conceptSummary,
          stage: conceptStage,
          status: conceptStatus,
          sortOrder: Number(conceptSortOrder || 0),
          principles: fromLines(conceptPrinciples),
          audienceFramings: fromLines(audienceFramings),
          formats: fromLines(conceptFormats),
          depths: fromLines(conceptDepths),
          prerequisites: fromLines(conceptPrerequisites),
          pairsWith: fromLines(pairsWith),
          evidence: fromLines(evidence),
          accessibilityNotes: fromLines(accessibilityNotes),
        }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Unable to save concept.');
      }
      setStatus('Concept saved.');
      await loadConcepts();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to save concept.');
    }
  }

  function editConcept(concept: ConceptRecord) {
    setConceptSlug(concept.slug);
    setConceptTitle(concept.title);
    setConceptSummary(concept.summary);
    setConceptStage(concept.stage);
    setConceptStatus(concept.status);
    setConceptSortOrder(String(concept.sort_order));
    setConceptPrinciples(toLines(concept.principles));
    setAudienceFramings(toLines(concept.audience_framings));
    setConceptFormats(toLines(concept.formats));
    setConceptDepths(toLines(concept.depths));
    setConceptPrerequisites(toLines(concept.prerequisites));
    setPairsWith(toLines(concept.pairs_with));
    setEvidence(toLines(concept.evidence));
    setAccessibilityNotes(toLines(concept.accessibility_notes));
    setSelectedConceptId(concept.id);
    loadVariants(concept.id).catch((error: Error) => setStatus(error.message));
  }

  async function deleteConcept(concept: ConceptRecord) {
    const response = await fetch('/api/revs/admin/concepts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revs-admin-token': token,
      },
      body: JSON.stringify({ action: 'delete', id: concept.id }),
    });
    const data = (await response.json()) as { ok?: boolean; error?: string };
    if (!response.ok || !data.ok) {
      setStatus(data.error || 'Unable to delete concept.');
      return;
    }
    await loadConcepts();
  }

  async function toggleConceptPublish(concept: ConceptRecord) {
    const response = await fetch('/api/revs/admin/concepts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revs-admin-token': token,
      },
      body: JSON.stringify({
        action: 'toggle',
        id: concept.id,
        status: concept.status === 'published' ? 'draft' : 'published',
      }),
    });
    const data = (await response.json()) as { ok?: boolean; error?: string };
    if (!response.ok || !data.ok) {
      setStatus(data.error || 'Unable to update publish status.');
      return;
    }
    setStatus(`Concept ${concept.status === 'published' ? 'unpublished' : 'published'}.`);
    await loadConcepts();
  }

  async function saveVariant() {
    if (!selectedConceptId) {
      setStatus('Select a concept first.');
      return;
    }
    try {
      const response = await fetch('/api/revs/admin/concepts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-revs-admin-token': token,
        },
        body: JSON.stringify({
          kind: 'variant',
          conceptId: selectedConceptId,
          variantKey,
          audience: variantAudience,
          format: variantFormat,
          depth: variantDepth,
          stage: variantStage,
          status: variantStatus,
          body: variantBody,
          notes: variantNotes,
          variantSortOrder: Number(variantSortOrder || 0),
        }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Unable to save variant.');
      }
      setStatus('Variant saved.');
      await loadVariants(selectedConceptId);
      setSelectedVariantId(null);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to save variant.');
    }
  }

  async function duplicateVariant(variant: VariantRecord) {
    const response = await fetch('/api/revs/admin/concepts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revs-admin-token': token,
      },
      body: JSON.stringify({ kind: 'variant', action: 'duplicate', id: variant.id }),
    });
    const data = (await response.json()) as { ok?: boolean; error?: string };
    if (!response.ok || !data.ok) {
      setStatus(data.error || 'Unable to duplicate variant.');
      return;
    }
    setStatus('Variant duplicated.');
    if (selectedConceptId) {
      await loadVariants(selectedConceptId);
    }
  }

  async function deleteVariant(variant: VariantRecord) {
    const response = await fetch('/api/revs/admin/concepts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revs-admin-token': token,
      },
      body: JSON.stringify({ kind: 'variant', action: 'delete', id: variant.id }),
    });
    const data = (await response.json()) as { ok?: boolean; error?: string };
    if (!response.ok || !data.ok) {
      setStatus(data.error || 'Unable to delete variant.');
      return;
    }
    setStatus('Variant deleted.');
    if (selectedConceptId) {
      await loadVariants(selectedConceptId);
    }
  }

  const activeCount = useMemo(() => invites.filter((invite) => invite.active).length, [invites]);
  const reviewConcepts = useMemo(() => concepts.filter((concept) => concept.status === 'review'), [concepts]);
  const draftConcepts = useMemo(() => concepts.filter((concept) => concept.status === 'draft'), [concepts]);
  const publishedConcepts = useMemo(() => concepts.filter((concept) => concept.status === 'published'), [concepts]);
  const archivedConcepts = useMemo(() => concepts.filter((concept) => concept.status === 'archived'), [concepts]);

  if (!ready) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <section className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Admin</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-navy dark:text-white">Content ops workbench</h1>
        <p className="mt-2 text-sm leading-7 text-ink-mid dark:text-slate-300">
          Create, review, and disable invite codes for the REVS cohort, then manage the atomic concepts and variants that power the user experience.
        </p>
        <div className="mt-4 rounded-2xl border border-teal/20 bg-teal/5 p-4 text-sm leading-7 text-ink-mid dark:text-slate-300">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Who this is for</p>
          <p className="mt-2">
            This surface is for admins only. Keep it calm and practical: invites, concept drafting, publishing, variant editing, and content review live here.
          </p>
        </div>
        <div className="mt-4 rounded-2xl border border-teal/20 bg-teal/5 p-4 text-sm leading-7 text-ink-mid dark:text-slate-300">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Principle check</p>
          <p className="mt-2">
            Keep content low-load, practical, and capacity-first. Review items should reduce shame, avoid heroic language, and support autonomy.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-ink-mid dark:text-slate-300">
          <span className="rounded-full border border-black/10 px-3 py-1 dark:border-white/10">{activeCount} active</span>
          <span className="rounded-full border border-black/10 px-3 py-1 dark:border-white/10">{revsAssessmentSystems.length} capacity systems</span>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="rounded-[1.5rem] border border-black/10 bg-white p-5 sm:p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">Unlock</h2>
          <label className="mt-4 grid gap-2 text-sm font-semibold text-navy dark:text-white">
            Admin token
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20"
              placeholder="REVS_ADMIN_TOKEN"
            />
          </label>
          <button onClick={unlock} className="mt-4 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white">
            Unlock admin
          </button>
          <p className="mt-3 text-sm text-ink-mid dark:text-slate-300">{status}</p>

          <div className="mt-6 space-y-3">
            <label className="grid gap-2 text-sm font-semibold text-navy dark:text-white">
              Invite code
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20"
                placeholder="REVS-001"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-navy dark:text-white">
              Label
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20"
                placeholder="First cohort"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-navy dark:text-white">
              Uses remaining
              <input
                value={usesRemaining}
                onChange={(e) => setUsesRemaining(e.target.value)}
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20"
                placeholder="50"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-navy dark:text-white">
              Expires at
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20"
              />
            </label>
            <button onClick={createInvite} className="rounded-full bg-teal px-5 py-3 text-sm font-semibold text-white">
              Create invite
            </button>
            <button
              onClick={createStarterInvite}
              className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-navy dark:border-white/10 dark:text-white"
            >
              Create starter invite
            </button>
          </div>

          <div className="mt-8 border-t border-black/10 pt-6 dark:border-white/10">
            <h3 className="font-serif text-xl font-bold text-navy dark:text-white">Allowlist email</h3>
            <div className="mt-4 space-y-3">
              <label className="grid gap-2 text-sm font-semibold text-navy dark:text-white">
                Email
                <input
                  value={allowlistEmail}
                  onChange={(e) => setAllowlistEmail(e.target.value)}
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20"
                  placeholder="name@example.com"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-navy dark:text-white">
                Label
                <input
                  value={allowlistLabel}
                  onChange={(e) => setAllowlistLabel(e.target.value)}
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20"
                  placeholder="Therapist cohort"
                />
              </label>
              <button onClick={createAllowlistEntry} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
                Add to allowlist
              </button>
            </div>
          </div>

          <div className="mt-8 border-t border-black/10 pt-6 dark:border-white/10">
            <h3 className="font-serif text-xl font-bold text-navy dark:text-white">Concept editor</h3>
            <div className="mt-4 space-y-3">
              <label className="grid gap-2 text-sm font-semibold text-navy dark:text-white">
                Slug
                <input
                  value={conceptSlug}
                  onChange={(e) => setConceptSlug(e.target.value)}
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20"
                  placeholder="sensory-processing-overload"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-navy dark:text-white">
                Title
                <input
                  value={conceptTitle}
                  onChange={(e) => setConceptTitle(e.target.value)}
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20"
                  placeholder="Sensory Processing & Overload"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-navy dark:text-white">
                Summary
                <textarea
                  value={conceptSummary}
                  onChange={(e) => setConceptSummary(e.target.value)}
                  className="min-h-28 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20"
                  placeholder="What the concept is about"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-navy dark:text-white">
                  Stage
                  <select
                    value={conceptStage}
                    onChange={(e) => setConceptStage(e.target.value)}
                    className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20"
                  >
                    <option>Recognise</option>
                    <option>Regulate</option>
                    <option>Rebuild</option>
                    <option>Redesign</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-semibold text-navy dark:text-white">
                  Status
                  <select
                    value={conceptStatus}
                    onChange={(e) => setConceptStatus(e.target.value)}
                    className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20"
                  >
                    <option value="draft">Draft</option>
                    <option value="review">Review</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
              </div>
              <label className="grid gap-2 text-sm font-semibold text-navy dark:text-white">
                Sort order
                <input value={conceptSortOrder} onChange={(e) => setConceptSortOrder(e.target.value)} className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20" />
              </label>
              {conceptFields.map((field) => {
                const fieldValue =
                  field.valueKey === 'principles'
                    ? conceptPrinciples
                    : field.valueKey === 'audienceFramings'
                      ? audienceFramings
                      : field.valueKey === 'conceptFormats'
                        ? conceptFormats
                        : field.valueKey === 'conceptDepths'
                          ? conceptDepths
                          : field.valueKey === 'conceptPrerequisites'
                            ? conceptPrerequisites
                            : field.valueKey === 'pairsWith'
                              ? pairsWith
                              : field.valueKey === 'evidence'
                                ? evidence
                                : accessibilityNotes;

                const setFieldValue =
                  field.valueKey === 'principles'
                    ? setConceptPrinciples
                    : field.valueKey === 'audienceFramings'
                      ? setAudienceFramings
                      : field.valueKey === 'conceptFormats'
                        ? setConceptFormats
                        : field.valueKey === 'conceptDepths'
                          ? setConceptDepths
                          : field.valueKey === 'conceptPrerequisites'
                            ? setConceptPrerequisites
                            : field.valueKey === 'pairsWith'
                              ? setPairsWith
                              : field.valueKey === 'evidence'
                                ? setEvidence
                                : setAccessibilityNotes;

                return (
                  <label key={field.label} className="grid gap-2 text-sm font-semibold text-navy dark:text-white">
                    {field.label}
                    <textarea
                      value={fieldValue}
                      onChange={(e) => setFieldValue(e.target.value)}
                      className="min-h-24 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20"
                      placeholder={field.placeholder}
                    />
                  </label>
                );
              })}
              <button onClick={saveConcept} className="rounded-full bg-teal px-5 py-3 text-sm font-semibold text-white">
                Save concept
              </button>
            </div>
            <div className="mt-4 rounded-2xl border border-teal/20 bg-teal/5 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Principle lens</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {principlesForStage(conceptStage).map((principle) => (
                  <span key={principle} className="rounded-full border border-teal/30 bg-white px-3 py-1 text-xs font-semibold text-navy dark:bg-black/10 dark:text-white">
                    {principle}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="rounded-[1.5rem] border border-black/10 bg-white p-5 sm:p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">Active invites</h2>
          <div className="mt-4 space-y-3">
            {invites.map((invite) => (
              <article key={invite.id} className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">{invite.code}</p>
                    <h3 className="mt-1 text-lg font-semibold text-navy dark:text-white">{invite.label || 'Untitled invite'}</h3>
                    <p className="mt-1 text-sm text-ink-mid dark:text-slate-300">
                      {invite.uses_remaining === null ? 'Unlimited uses' : `${invite.uses_remaining} uses remaining`}
                    </p>
                    <p className="mt-1 text-xs text-ink-light dark:text-slate-400">
                      {invite.expires_at ? `Expires ${new Date(invite.expires_at).toLocaleString()}` : 'No expiry'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => copyInviteCode(invite.code)}
                      className="rounded-full bg-black/5 px-4 py-2 text-sm font-semibold text-ink-mid dark:bg-white/10 dark:text-white"
                    >
                      {copiedCode === invite.code ? 'Copied' : 'Copy code'}
                    </button>
                    <button
                      onClick={() => toggleInvite(invite)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        invite.active ? 'bg-slate-950 text-white' : 'bg-black/10 text-ink-mid dark:bg-white/10 dark:text-white'
                      }`}
                    >
                      {invite.active ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {invites.length === 0 ? <p className="text-sm text-ink-mid dark:text-slate-300">No invites yet.</p> : null}
          </div>

          <div className="mt-8 border-t border-black/10 pt-6 dark:border-white/10">
            <h3 className="font-serif text-xl font-bold text-navy dark:text-white">Concept variants</h3>
            <label className="mt-4 grid gap-2 text-sm font-semibold text-navy dark:text-white">
              Select concept
              <select
                value={selectedConceptId ?? ''}
                onChange={async (e) => {
                  const nextId = e.target.value ? Number(e.target.value) : null;
                  setSelectedConceptId(nextId);
                  if (nextId) {
                    await loadVariants(nextId).catch((error: Error) => setStatus(error.message));
                  } else {
                    setVariants([]);
                  }
                }}
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20"
              >
                <option value="">Choose a concept</option>
                {concepts.map((concept) => (
                  <option key={concept.id} value={concept.id}>
                    {concept.title} ({concept.status})
                  </option>
                ))}
              </select>
            </label>
            <div className="mt-4 space-y-3">
              {variants.map((variant) => (
                <article
                  key={variant.id}
                  className={`rounded-2xl border p-4 dark:border-white/10 ${
                    selectedVariantId === variant.id ? 'border-teal bg-teal/5' : 'border-black/10'
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-navy dark:text-white">{variant.variant_key}</p>
                      <p className="text-xs text-ink-mid dark:text-slate-300">
                        {variant.audience} • {variant.format} • {variant.depth} • {variant.status}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={async () => {
                          setSelectedVariantId(variant.id);
                          setVariantKey(variant.variant_key);
                          setVariantAudience(variant.audience);
                          setVariantFormat(variant.format);
                          setVariantDepth(variant.depth);
                          setVariantStage(variant.stage);
                          setVariantStatus(variant.status);
                          setVariantBody(variant.body);
                          setVariantNotes(variant.notes);
                          setVariantSortOrder(String(variant.sort_order));
                        }}
                        className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold dark:border-white/10"
                      >
                        {selectedVariantId === variant.id ? 'Editing' : 'Edit'}
                      </button>
                      <button
                        onClick={() => duplicateVariant(variant)}
                        className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold dark:border-white/10"
                      >
                        Duplicate
                      </button>
                      <button
                        onClick={() => deleteVariant(variant)}
                        className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-red-600 dark:border-white/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {variant.body ? <p className="mt-3 text-sm leading-7 text-ink-mid dark:text-slate-300">{variant.body}</p> : null}
                </article>
              ))}
            </div>
            {selectedConceptId ? (
              <div className="mt-4 rounded-2xl border border-black/10 p-4 dark:border-white/10">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Variant preview</p>
                <div className="mt-3 rounded-2xl bg-black/[0.03] p-4 dark:bg-white/[0.05]">
                  <p className="text-sm font-semibold text-navy dark:text-white">
                    {variantKey || 'Untitled variant'} - {variantStatus}
                  </p>
                  <p className="mt-1 text-xs text-ink-mid dark:text-slate-300">
                    {variantAudience} • {variantFormat} • {variantDepth} • {variantStage}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-ink-mid dark:text-slate-300">
                    {variantBody || 'Variant body preview will appear here.'}
                  </p>
                </div>
              </div>
            ) : null}
            <div className="mt-4 space-y-3">
              <label className="grid gap-2 text-sm font-semibold text-navy dark:text-white">
                Variant key
                <input value={variantKey} onChange={(e) => setVariantKey(e.target.value)} className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20" placeholder="individual-article-5m" />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-navy dark:text-white">
                  Audience
                  <select value={variantAudience} onChange={(e) => setVariantAudience(e.target.value)} className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20">
                    <option>Individual</option>
                    <option>Therapist</option>
                    <option>Workplace</option>
                    <option>Educator</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-semibold text-navy dark:text-white">
                  Format
                  <select value={variantFormat} onChange={(e) => setVariantFormat(e.target.value)} className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20">
                    <option>Poster</option>
                    <option>Video script</option>
                    <option>Article</option>
                    <option>Worksheet</option>
                    <option>Presentation</option>
                    <option>Podcast</option>
                    <option>Social</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-semibold text-navy dark:text-white">
                  Depth
                  <select value={variantDepth} onChange={(e) => setVariantDepth(e.target.value)} className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20">
                    <option>1-minute</option>
                    <option>5-minute</option>
                    <option>20-minute</option>
                    <option>60-minute</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-semibold text-navy dark:text-white">
                  Status
                  <select value={variantStatus} onChange={(e) => setVariantStatus(e.target.value)} className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20">
                    <option value="draft">Draft</option>
                    <option value="review">Review</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
              </div>
              <label className="grid gap-2 text-sm font-semibold text-navy dark:text-white">
                Body
                <textarea value={variantBody} onChange={(e) => setVariantBody(e.target.value)} className="min-h-28 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20" />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-navy dark:text-white">
                Notes
                <textarea value={variantNotes} onChange={(e) => setVariantNotes(e.target.value)} className="min-h-20 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20" />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-navy dark:text-white">
                Sort order
                <input value={variantSortOrder} onChange={(e) => setVariantSortOrder(e.target.value)} className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20" />
              </label>
              <button onClick={saveVariant} className="rounded-full bg-teal px-5 py-3 text-sm font-semibold text-white">
                Save variant
              </button>
            </div>
          </div>
        </section>
      </section>

      <section className="mt-6 rounded-[1.5rem] border border-black/10 bg-white p-5 sm:p-6 dark:border-white/10 dark:bg-white/5">
        <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">Concept library</h2>
        <div className="mt-4 grid gap-4">
          {reviewConcepts.length ? (
            <div className="rounded-2xl border border-teal/20 bg-teal/5 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Review queue</p>
              <div className="mt-3 space-y-3">
                {reviewConcepts.map((concept) => (
                  <article key={concept.id} className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">{concept.slug}</p>
                        <h3 className="mt-1 text-lg font-semibold text-navy dark:text-white">{concept.title}</h3>
                        <p className="mt-1 text-sm text-ink-mid dark:text-slate-300">{concept.summary}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {principlesForStage(concept.stage).map((principle) => (
                            <span key={principle} className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold dark:border-white/10">
                              {principle}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => editConcept(concept)} className="rounded-full bg-black/5 px-4 py-2 text-sm font-semibold text-ink-mid dark:bg-white/10 dark:text-white">
                          Edit
                        </button>
                        <button onClick={() => toggleConceptPublish(concept)} className="rounded-full bg-black/5 px-4 py-2 text-sm font-semibold text-ink-mid dark:bg-white/10 dark:text-white">
                          Publish
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
          {publishedConcepts.length ? (
            <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Published</p>
              <div className="mt-3 space-y-3">
                {publishedConcepts.map((concept) => (
                  <article key={concept.id} className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">{concept.slug}</p>
                        <h3 className="mt-1 text-lg font-semibold text-navy dark:text-white">{concept.title}</h3>
                        <p className="mt-1 text-sm text-ink-mid dark:text-slate-300">{concept.summary}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {principlesForStage(concept.stage).map((principle) => (
                            <span key={principle} className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold dark:border-white/10">
                              {principle}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => editConcept(concept)} className="rounded-full bg-black/5 px-4 py-2 text-sm font-semibold text-ink-mid dark:bg-white/10 dark:text-white">
                          Edit
                        </button>
                        <button onClick={() => toggleConceptPublish(concept)} className="rounded-full bg-black/5 px-4 py-2 text-sm font-semibold text-ink-mid dark:bg-white/10 dark:text-white">
                          Unpublish
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
          {draftConcepts.length ? (
            <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Drafts</p>
              <div className="mt-3 space-y-3">
                {draftConcepts.map((concept) => (
                  <article key={concept.id} className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">{concept.slug}</p>
                        <h3 className="mt-1 text-lg font-semibold text-navy dark:text-white">{concept.title}</h3>
                        <p className="mt-1 text-sm text-ink-mid dark:text-slate-300">{concept.summary}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {principlesForStage(concept.stage).map((principle) => (
                            <span key={principle} className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold dark:border-white/10">
                              {principle}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => editConcept(concept)} className="rounded-full bg-black/5 px-4 py-2 text-sm font-semibold text-ink-mid dark:bg-white/10 dark:text-white">
                          Edit
                        </button>
                        <button onClick={() => toggleConceptPublish(concept)} className="rounded-full bg-black/5 px-4 py-2 text-sm font-semibold text-ink-mid dark:bg-white/10 dark:text-white">
                          Publish
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
          {archivedConcepts.length ? (
            <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Archived</p>
              <div className="mt-3 space-y-3">
                {archivedConcepts.map((concept) => (
                  <article key={concept.id} className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">{concept.slug}</p>
                        <h3 className="mt-1 text-lg font-semibold text-navy dark:text-white">{concept.title}</h3>
                        <p className="mt-1 text-sm text-ink-mid dark:text-slate-300">{concept.summary}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {principlesForStage(concept.stage).map((principle) => (
                            <span key={principle} className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold dark:border-white/10">
                              {principle}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => editConcept(concept)} className="rounded-full bg-black/5 px-4 py-2 text-sm font-semibold text-ink-mid dark:bg-white/10 dark:text-white">
                          Edit
                        </button>
                        <button onClick={() => toggleConceptPublish(concept)} className="rounded-full bg-black/5 px-4 py-2 text-sm font-semibold text-ink-mid dark:bg-white/10 dark:text-white">
                          Restore
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
