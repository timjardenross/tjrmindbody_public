"use strict";exports.id=8831,exports.ids=[8831],exports.modules={18831:(e,t,s)=>{s.a(e,async(e,a)=>{try{s.d(t,{C$:()=>l,DN:()=>g,En:()=>o,FE:()=>R,F_:()=>y,Hc:()=>n,JF:()=>L,JV:()=>N,Jq:()=>m,ND:()=>$,OL:()=>j,V9:()=>u,Wb:()=>b,Yg:()=>D,ah:()=>d,bc:()=>c,ex:()=>p,f2:()=>A,fB:()=>C,g:()=>O,k2:()=>P,mc:()=>S,po:()=>f,ug:()=>z,yN:()=>q});var r=s(8678),i=e([r]);r=(i.then?(await i)():i)[0];let E=process.env.DATABASE_URL;function n(e){return e.trim().toLowerCase()}function d(){return!!E}function l(){if(!E)throw Error("DATABASE_URL is not set.");return global.__revsPgPool||(global.__revsPgPool=new r.Pool({connectionString:E,ssl:"disable"===process.env.PGSSLMODE?void 0:{rejectUnauthorized:!1},max:5})),global.__revsPgPool}async function u(){let e=l();await e.query(`
    create table if not exists revs_users (
      id bigint generated always as identity primary key,
      email text not null unique,
      password_hash text,
      display_name text not null default '',
      dark_mode_pref boolean not null default false,
      current_stage text not null default 'Recognise',
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `),await e.query(`
    create table if not exists revs_invites (
      id bigint generated always as identity primary key,
      code text not null unique,
      label text not null default '',
      active boolean not null default true,
      uses_remaining integer,
      expires_at timestamptz,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `),await e.query(`
    create table if not exists revs_allowlist (
      id bigint generated always as identity primary key,
      email text not null unique,
      label text not null default '',
      active boolean not null default true,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `),await e.query(`
    create table if not exists revs_assessments (
      id bigint generated always as identity primary key,
      user_id bigint not null references revs_users(id) on delete cascade,
      email text not null,
      stage text not null,
      scores jsonb not null,
      capacity_profile jsonb not null,
      notes text not null default '',
      created_at timestamptz not null default now()
    );
  `),await e.query(`
    create table if not exists revs_concepts (
      id bigint generated always as identity primary key,
      slug text not null unique,
      title text not null,
      summary text not null default '',
      stage text not null default 'Recognise',
      status text not null default 'draft',
      sort_order integer not null default 0,
      principles jsonb not null default '[]'::jsonb,
      audience_framings jsonb not null default '[]'::jsonb,
      formats jsonb not null default '[]'::jsonb,
      depths jsonb not null default '[]'::jsonb,
      prerequisites jsonb not null default '[]'::jsonb,
      pairs_with jsonb not null default '[]'::jsonb,
      evidence jsonb not null default '[]'::jsonb,
      accessibility_notes jsonb not null default '[]'::jsonb,
      published_at timestamptz,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `),await e.query("alter table revs_concepts add column if not exists principles jsonb not null default '[]'::jsonb;"),await e.query(`
    create table if not exists revs_progress_events (
      id bigint generated always as identity primary key,
      email text not null,
      concept_slug text not null default '',
      event_type text not null,
      note text not null default '',
      metadata jsonb not null default '{}'::jsonb,
      created_at timestamptz not null default now()
    );
  `)}async function o(e){let t=l(),s=e?`
      select id, user_id, email, stage, scores, capacity_profile, notes, created_at
      from revs_assessments
      where email = $1
      order by created_at desc, id desc
      limit 1
    `:`
      select id, user_id, email, stage, scores, capacity_profile, notes, created_at
      from revs_assessments
      order by created_at desc, id desc
      limit 1
    `;return(e?await t.query(s,[n(e)]):await t.query(s)).rows[0]||null}async function c(e){let t=l();return(await t.query(`
      select id, email, password_hash, display_name, dark_mode_pref, current_stage, created_at, updated_at
      from revs_users
      where email = $1
      limit 1
    `,[n(e)])).rows[0]||null}async function _(e){let t=l();return(await t.query(`
      select id, code, label, active, uses_remaining, expires_at, created_at, updated_at
      from revs_invites
      where code = $1
      limit 1
    `,[e.trim().toUpperCase()])).rows[0]||null}async function p(e){let t=l();return(await t.query(`
      select id, email, label, active, created_at, updated_at
      from revs_allowlist
      where email = $1 and active = true
      limit 1
    `,[n(e)])).rows[0]||null}async function m(e){let t=l(),s=e.trim().toUpperCase(),a=await _(s);if(!a||!a.active||a.expires_at&&new Date(a.expires_at).getTime()<Date.now()||null!==a.uses_remaining&&a.uses_remaining<=0)return null;let r=null===a.uses_remaining?null:a.uses_remaining-1;return(await t.query(`
      update revs_invites
      set uses_remaining = $2, updated_at = now()
      where id = $1
      returning id, code, label, active, uses_remaining, expires_at, created_at, updated_at
    `,[a.id,r])).rows[0]||null}async function y(e){let t=l(),s=n(e.email),a=e.currentStage?.trim()||"Recognise";return(await t.query(`
      insert into revs_users (email, current_stage)
      values ($1, $2)
      on conflict (email)
      do update set current_stage = excluded.current_stage, updated_at = now()
      returning id, email, password_hash, display_name, dark_mode_pref, current_stage, created_at, updated_at
    `,[s,a])).rows[0]||null}async function f(e){let t=l(),s=n(e.email),a=await y({email:s,currentStage:e.stage}),r=a?.id;if(!r)throw Error("Unable to resolve user record.");return(await t.query(`
    insert into revs_assessments (user_id, email, stage, scores, capacity_profile, notes)
    values ($1, $2, $3, $4::jsonb, $5::jsonb, $6)
    returning id, user_id, email, stage, scores, capacity_profile, notes, created_at
    `,[r,a.email,e.stage,JSON.stringify(e.scores),JSON.stringify(e.capacityProfile),e.notes||""])).rows[0]||null}async function g(e){let t=l(),s=e.code.trim().toUpperCase();return(await t.query(`
      insert into revs_invites (code, label, uses_remaining, expires_at)
      values ($1, $2, $3, $4)
      on conflict (code)
      do update set
        label = excluded.label,
        uses_remaining = excluded.uses_remaining,
        expires_at = excluded.expires_at,
        updated_at = now()
      returning id, code, label, active, uses_remaining, expires_at, created_at, updated_at
    `,[s,e.label||"",e.usesRemaining??null,e.expiresAt??null])).rows[0]||null}async function b(e){let t=l(),s=n(e.email);return(await t.query(`
      insert into revs_allowlist (email, label, active)
      values ($1, $2, $3)
      on conflict (email)
      do update set
        label = excluded.label,
        active = excluded.active,
        updated_at = now()
      returning id, email, label, active, created_at, updated_at
    `,[s,e.label||"",e.active??!0])).rows[0]||null}function h(e){return JSON.stringify((e||[]).map(e=>e.trim()).filter(Boolean))}function w(e){return e?.trim()||null}function v(e,t){return!t||e.some(e=>e.toLowerCase()===t.toLowerCase())}function x(e,t=[]){return Array.isArray(e)?e.map(e=>String(e)).filter(Boolean):t}function $(e){let t="Recognise"===e.stage?["capacity over deficit","low cognitive load"]:"Regulate"===e.stage?["sustainability over heroism","autonomy and agency"]:"Rebuild"===e.stage?["practical and specific","authenticity over masking"]:["honour lived experience","autonomy and agency"];return{slug:e.slug,title:e.title,stage:e.stage,summary:e.summary,tags:[e.stage,...e.audience_framings.slice(0,2)].filter(Boolean),principles:x(e.principles,t),audiences:x(e.audience_framings,["Individual"]),formats:x(e.formats,["Article"]),depths:x(e.depths,["5-minute"]),prerequisites:x(e.prerequisites),pairsWith:x(e.pairs_with),evidence:x(e.evidence),accessibilityNotes:x(e.accessibility_notes)}}async function q(){let e=l();return(await e.query(`
      select
        id, slug, title, summary, stage, status, sort_order, principles,
        audience_framings, formats, depths, prerequisites, pairs_with, evidence, accessibility_notes,
        published_at, created_at, updated_at
      from revs_concepts
      order by sort_order asc, stage asc, title asc, id desc
    `)).rows}async function j(e={}){let t=l(),s=w(e.stage),a=w(e.audience),r=w(e.format),i=w(e.depth),n=["status = 'published'"],d=[];return s&&(d.push(s),n.push(`stage = $${d.length}`)),a&&(d.push(a),n.push(`audience_framings @> jsonb_build_array($${d.length})`)),r&&(d.push(r),n.push(`formats @> jsonb_build_array($${d.length})`)),i&&(d.push(i),n.push(`depths @> jsonb_build_array($${d.length})`)),(await t.query(`
      select
        id, slug, title, summary, stage, status, sort_order, principles,
        audience_framings, formats, depths, prerequisites, pairs_with, evidence, accessibility_notes,
        published_at, created_at, updated_at
      from revs_concepts
      where ${n.join(" and ")}
      order by sort_order asc, stage asc, title asc, id desc
    `,d)).rows}async function k(e){let t=l();return(await t.query(`
      select
        id, slug, title, summary, stage, status, sort_order, principles,
        audience_framings, formats, depths, prerequisites, pairs_with, evidence, accessibility_notes,
        published_at, created_at, updated_at
      from revs_concepts
      where slug = $1 and status = 'published'
      limit 1
    `,[e.trim().toLowerCase()])).rows[0]||null}async function C(e){let t=l();return(await t.query(`
      select
        id, slug, title, summary, stage, status, sort_order, principles,
        audience_framings, formats, depths, prerequisites, pairs_with, evidence, accessibility_notes,
        published_at, created_at, updated_at
      from revs_concepts
      where slug = $1
      limit 1
    `,[e.trim().toLowerCase()])).rows[0]||null}async function z(e){let t=l();return(e?await t.query(`
          select id, concept_id, variant_key, audience, format, depth, stage, status, body, notes, sort_order, published_at, created_at, updated_at
          from revs_concept_variants
          where concept_id = $1 and status = 'published'
          order by sort_order asc, updated_at desc, id desc
        `,[e]):await t.query(`
          select id, concept_id, variant_key, audience, format, depth, stage, status, body, notes, sort_order, published_at, created_at, updated_at
          from revs_concept_variants
          where status = 'published'
          order by sort_order asc, updated_at desc, id desc
        `)).rows}async function R(e){let t=l(),s=await k(e.slug);if(!s)return{source:null,related:[]};let a=w(e.stage)||s.stage,r=w(e.audience),i=w(e.format),n=w(e.depth),d=Math.max(1,Math.min(e.limit??5,10)),u=(await t.query(`
      select
        id, slug, title, summary, stage, status, sort_order,
        audience_framings, formats, depths, prerequisites, pairs_with, evidence, accessibility_notes,
        published_at, created_at, updated_at
      from revs_concepts
      where status = 'published' and slug <> $1
      order by sort_order asc, stage asc, title asc, id desc
    `,[s.slug])).rows.map(e=>{let t="next",d=0,l=[];return(s.prerequisites.includes(e.title)||s.pairs_with.includes(e.title))&&(t=s.prerequisites.includes(e.title)?"prerequisite":"paired",d+=50,l.push("prerequisite"===t?"Referenced as a prerequisite":"Referenced in pairs_with")),(e.prerequisites.includes(s.title)||e.pairs_with.includes(s.title))&&(t=e.prerequisites.includes(s.title)?"next":"paired",d+=35,l.push(e.prerequisites.includes(s.title)?"Cited as a prerequisite by this concept":"Mutually paired concept")),e.stage===a&&(d+=15,l.push("Matches the requested stage")),v(e.audience_framings,r)&&(d+=r?10:0,r&&l.push("Matches the requested audience")),v(e.formats,i)&&(d+=i?10:0,i&&l.push("Matches the requested format")),v(e.depths,n)&&(d+=n?10:0,n&&l.push("Matches the requested depth")),l.length||l.push("Closest published concept by stage and ordering"),{...e,relationship:t,match_reason:l.join("; "),__score:d}}).sort((e,t)=>t.__score-e.__score||e.sort_order-t.sort_order||e.title.localeCompare(t.title)).slice(0,d).map(({__score:e,...t})=>t);return{source:s,related:u}}async function S(e){let t=l();return e.status,(await t.query(`
      insert into revs_concepts (
        slug, title, summary, stage, status, sort_order, principles,
        audience_framings, formats, depths, prerequisites, pairs_with, evidence, accessibility_notes
      )
      values ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9::jsonb, $10::jsonb, $11::jsonb, $12::jsonb, $13::jsonb, $14::jsonb)
      on conflict (slug)
      do update set
        title = excluded.title,
        summary = excluded.summary,
        stage = excluded.stage,
        status = excluded.status,
        sort_order = excluded.sort_order,
        principles = excluded.principles,
        audience_framings = excluded.audience_framings,
        formats = excluded.formats,
        depths = excluded.depths,
        prerequisites = excluded.prerequisites,
        pairs_with = excluded.pairs_with,
        evidence = excluded.evidence,
        accessibility_notes = excluded.accessibility_notes,
        published_at = case when excluded.status = 'published' then coalesce(revs_concepts.published_at, now()) else null end,
        updated_at = now()
      returning id, slug, title, summary, stage, status, sort_order, principles,
        audience_framings, formats, depths, prerequisites, pairs_with, evidence, accessibility_notes,
        published_at, created_at, updated_at
    `,[e.slug.trim().toLowerCase(),e.title.trim(),e.summary||"",e.stage||"Recognise",e.status||"draft",e.sortOrder??0,h(e.principles),h(e.audienceFramings),h(e.formats),h(e.depths),h(e.prerequisites),h(e.pairsWith),h(e.evidence),h(e.accessibilityNotes)])).rows[0]||null}async function A(e){let t=l();return(await t.query(`
      update revs_concepts
      set status = $2,
          published_at = case when $2 = 'published' then coalesce(published_at, now()) else null end,
          updated_at = now()
      where id = $1
      returning id, slug, title, summary, stage, status, sort_order,
        audience_framings, formats, depths, prerequisites, pairs_with, evidence, accessibility_notes,
        published_at, created_at, updated_at
    `,[e.id,e.status])).rows[0]||null}async function L(e){let t=l();return(e?await t.query(`
          select id, concept_id, variant_key, audience, format, depth, stage, status, body, notes, sort_order, published_at, created_at, updated_at
          from revs_concept_variants
          where concept_id = $1
          order by sort_order asc, updated_at desc, id desc
        `,[e]):await t.query(`
          select id, concept_id, variant_key, audience, format, depth, stage, status, body, notes, sort_order, published_at, created_at, updated_at
          from revs_concept_variants
          order by sort_order asc, updated_at desc, id desc
        `)).rows}async function N(e){let t=l();return(await t.query(`
      insert into revs_concept_variants (
        concept_id, variant_key, audience, format, depth, stage, status, body, notes, sort_order, published_at
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, case when $7 = 'published' then now() else null end)
      on conflict (concept_id, variant_key)
      do update set
        audience = excluded.audience,
        format = excluded.format,
        depth = excluded.depth,
        stage = excluded.stage,
        status = excluded.status,
        body = excluded.body,
        notes = excluded.notes,
        sort_order = excluded.sort_order,
        published_at = case when excluded.status = 'published' then coalesce(revs_concept_variants.published_at, now()) else null end,
        updated_at = now()
      returning id, concept_id, variant_key, audience, format, depth, stage, status, body, notes, sort_order, published_at, created_at, updated_at
    `,[e.conceptId,e.variantKey.trim().toLowerCase(),e.audience||"Individual",e.format||"Article",e.depth||"5-minute",e.stage||"Recognise",e.status||"draft",e.body||"",e.notes||"",e.sortOrder??0])).rows[0]||null}async function P(e){let t=l();return(await t.query(`
      delete from revs_concept_variants
      where id = $1
      returning id, concept_id, variant_key, audience, format, depth, stage, status, body, notes, sort_order, published_at, created_at, updated_at
    `,[e.id])).rows[0]||null}async function M(e){let t=l();return(e?await t.query(`
          select id, email, concept_slug, event_type, note, metadata, created_at
          from revs_progress_events
          where email = $1
          order by created_at desc, id desc
          limit 20
        `,[n(e)]):await t.query(`
        select id, email, concept_slug, event_type, note, metadata, created_at
        from revs_progress_events
        order by created_at desc, id desc
        limit 20
      `)).rows}async function O(e){let t=await M(e),s=t.reduce((e,t)=>(e[t.event_type]=(e[t.event_type]||0)+1,e),{});return{events:t,counts:s}}async function D(e){let t=l();return(await t.query(`
      insert into revs_progress_events (email, concept_slug, event_type, note, metadata)
      values ($1, $2, $3, $4, $5::jsonb)
      returning id, email, concept_slug, event_type, note, metadata, created_at
    `,[n(e.email),e.conceptSlug||"",e.eventType,e.note||"",JSON.stringify(e.metadata||{})])).rows[0]}a()}catch(e){a(e)}})}};