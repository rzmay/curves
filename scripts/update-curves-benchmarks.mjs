#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const START_MARKER = '<!-- CURVES_BENCHMARKS_START -->';
const END_MARKER = '<!-- CURVES_BENCHMARKS_END -->';
const BENCHMARK_PREFIX = 'CURVES_BENCHMARK';
const GENERATION_COMMAND = 'npm run benchmark:curves:update';
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));

function parseBenchmarkRows(output) {
  return output
    .split(/\r?\n/)
    .filter((line) => line.startsWith(BENCHMARK_PREFIX))
    .map((line) => {
      const row = {};
      for (const field of line.split('\t').slice(1)) {
        const separatorIndex = field.indexOf('=');
        if (separatorIndex === -1) continue;
        row[field.slice(0, separatorIndex)] = field.slice(separatorIndex + 1);
      }
      return row;
    });
}

function formatMarkdownTable(rows) {
  const header = [
    '| Case | Evaluations | Total ms | Ops/sec | Checksum |',
    '| --- | ---: | ---: | ---: | ---: |',
  ];
  const body = rows.map((row) => [
    `| ${row.name}`,
    Number(row.evaluations).toLocaleString('en-US'),
    Number(row.total_ms).toFixed(3),
    Number(row.ops_per_second).toLocaleString('en-US'),
    `${Number(row.checksum).toFixed(6)} |`,
  ].join(' | '));

  return [...header, ...body].join('\n');
}

function renderSection(rows) {
  return [
    START_MARKER,
    '### Curves Benchmarks',
    '',
    `Generated with \`${GENERATION_COMMAND}\` on Node \`${process.version}\`.`,
    '',
    formatMarkdownTable(rows),
    END_MARKER,
  ].join('\n');
}

function updateReadme(readme, section) {
  const startIndex = readme.indexOf(START_MARKER);
  const endIndex = readme.indexOf(END_MARKER);

  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    return `${readme.slice(0, startIndex)}${section}${readme.slice(endIndex + END_MARKER.length)}`;
  }

  const trimmed = readme.replace(/\s*$/, '');
  return `${trimmed}\n\n${section}\n`;
}

const output = execFileSync('npm', ['run', 'benchmark:curves'], {
  cwd: resolve(SCRIPT_DIR, '..'),
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'inherit'],
});
const rows = parseBenchmarkRows(output);

if (rows.length === 0) {
  throw new Error('No benchmark rows were found in benchmark output.');
}

const readmePath = resolve(SCRIPT_DIR, '..', 'README.md');
const readme = readFileSync(readmePath, 'utf8');
const updatedReadme = updateReadme(readme, renderSection(rows));

writeFileSync(readmePath, updatedReadme);
console.log(`Updated README.md with ${rows.length} benchmark rows.`);
