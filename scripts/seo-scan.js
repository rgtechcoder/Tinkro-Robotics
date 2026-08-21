import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST = path.join(__dirname, '..', 'dist');

function walk(dir) {
  const files = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) files.push(...walk(full));
    else if (/index\.html$/.test(name)) files.push(full);
  }
  return files;
}

function readHead(html) {
  const m = html.match(/<head[\s\S]*?>[\s\S]*?<\/head>/i);
  return m ? m[0] : '';
}

function existsAsset(assetPath) {
  const p = path.join(DIST, assetPath.replace(/^\//, ''));
  return fs.existsSync(p);
}

const files = walk(DIST);
const report = [];
let critical = 0, medium = 0, minor = 0;

files.sort();
for (const file of files) {
  const rel = path.relative(DIST, file).replace(/\\/g, '/');
  const html = fs.readFileSync(file, 'utf8');
  const head = readHead(html);

  const issues = [];

  const titleMatches = (head.match(/<title[^>]*>[\s\S]*?<\/title>/gi) || []);
  if (titleMatches.length === 0) {
    issues.push({sev:'critical', msg:'missing <title>'}); critical++;
  } else if (titleMatches.length > 1) {
    issues.push({sev:'medium', msg:'multiple <title> tags'}); medium++;
  }

  const descMatches = (head.match(/<meta[^>]+name=["']description["'][^>]*>/gi) || []);
  if (descMatches.length === 0) { issues.push({sev:'critical', msg:'missing meta description'}); critical++; }
  else if (descMatches.length > 1) { issues.push({sev:'minor', msg:'multiple meta description tags'}); minor++; }

  const canonicalMatches = (head.match(/<link[^>]+rel=["']canonical["'][^>]*>/gi) || []);
  if (canonicalMatches.length === 0) { issues.push({sev:'critical', msg:'missing canonical'}); critical++; }
  else if (canonicalMatches.length > 1) { issues.push({sev:'medium', msg:'multiple canonical links'}); medium++; }
  else {
    const href = canonicalMatches[0].match(/href=["']([^"']+)["']/);
    if (!href) { issues.push({sev:'medium', msg:'canonical without href'}); medium++; }
    else if (!href[1].startsWith('https://tinkro.in')) { issues.push({sev:'critical', msg:`canonical not pointing to https://tinkro.in (${href[1]})`}); critical++; }
  }

  const robotsMatches = (head.match(/<meta[^>]+name=["']robots["'][^>]*>/gi) || []);
  if (robotsMatches.length === 0) { issues.push({sev:'minor', msg:'missing robots meta'}); minor++; }
  else if (robotsMatches.length > 1) { issues.push({sev:'minor', msg:'multiple robots meta tags'}); minor++; }

  // OpenGraph checks
  const ogRequired = ['og:title','og:description','og:type','og:image','og:url'];
  for (const key of ogRequired) {
    const re = new RegExp(`<meta[^>]+property=["']${key}["'][^>]*>`, 'i');
    if (!re.test(head)) { issues.push({sev:'medium', msg:`missing ${key}`}); medium++; }
  }

  // Twitter checks
  const twRequired = ['twitter:card','twitter:image'];
  for (const key of twRequired) {
    const re = new RegExp(`<meta[^>]+name=["']${key}["'][^>]*>`, 'i');
    if (!re.test(head)) { issues.push({sev:'medium', msg:`missing ${key}`} ); medium++; }
  }

  // JSON-LD presence
  const jsonldMatches = (head.match(/<script[^>]+type=["']application\/ld\+json["'][\s\S]*?<\/script>/gi) || []);
  if (jsonldMatches.length === 0) { issues.push({sev:'medium', msg:'missing JSON-LD'}); medium++; }
  else if (jsonldMatches.length > 3) { issues.push({sev:'minor', msg:'many JSON-LD blocks (>3)'}); minor++; }

  // Duplicate schema detection (exact duplicate text)
  const bodies = jsonldMatches.map(s=>s.replace(/\s+/g,' ').trim());
  const duplicates = bodies.filter((b,i)=> bodies.indexOf(b)!==i);
  if (duplicates.length) { issues.push({sev:'minor', msg:'duplicate JSON-LD content'}); minor++; }

  // localhost/127.0.0.1 check
  if (html.includes('localhost') || html.includes('127.0.0.1')) { issues.push({sev:'critical', msg:'contains localhost/127.0.0.1 references'}); critical++; }

  // Internal asset references starting with /assets -> verify file exists
  const assetRefs = [...head.matchAll(/(?:href|src)=["'](\/assets\/[^"]+)["']/gi)].map(m=>m[1]);
  for (const a of assetRefs) {
    if (!existsAsset(a)) { issues.push({sev:'minor', msg:`missing asset ${a}`} ); minor++; }
  }

  report.push({file:rel, issues});
}

// Summarize
console.log('SEO SCAN REPORT');
console.log('Files scanned:', files.length);
let totalIssues = 0;
for (const r of report) {
  if (r.issues.length) {
    console.log('\n---', r.file);
    for (const it of r.issues) { console.log(` [${it.sev}] ${it.msg}`); totalIssues++; }
  }
}

console.log('\nSummary:');
console.log(' Critical:', critical);
console.log(' Medium:', medium);
console.log(' Minor:', minor);
console.log(' Total issues:', totalIssues);

const score = critical>0 ? 'FAIL' : (medium>5 ? 'WARN' : 'PASS');
console.log('\nSEO SCORE:', score);

process.exit(0);
