#!/usr/bin/env node

import { performance } from 'node:perf_hooks';
import {
  Curve,
  Modifiers,
  NumberKeyframe,
  RGBColorKeyframe,
  SineModifierBlendMode,
  Vector3Keyframe,
} from '../build/index.mjs';

const EVALUATIONS = 200_000;
const PREFIX = 'CURVES_BENCHMARK';

function timeFor(iterations, fn) {
  let checksum = 0;
  const startedAt = performance.now();

  for (let i = 0; i < iterations; i += 1) {
    checksum += fn(i);
  }

  const totalMs = performance.now() - startedAt;
  return { totalMs, checksum };
}

function numberFromValue(value) {
  if (typeof value === 'number') return value;
  if (typeof value === 'object' && value !== null) {
    if ('x' in value) return value.x + value.y + value.z;
    if ('r' in value) return value.r + value.g + value.b;
  }

  return 0;
}

function emitRow(name, iterations, totalMs, checksum) {
  const opsPerSecond = (iterations / totalMs) * 1000;
  const fields = [
    PREFIX,
    `name=${name}`,
    `evaluations=${iterations}`,
    `total_ms=${totalMs.toFixed(3)}`,
    `ops_per_second=${opsPerSecond.toFixed(0)}`,
    `checksum=${checksum.toFixed(6)}`,
  ];

  console.log(fields.join('\t'));
}

function makeNumericCurve() {
  return new Curve([
    new NumberKeyframe(0, 0),
    new NumberKeyframe(0.25, 4),
    new NumberKeyframe(0.5, -2),
    new NumberKeyframe(0.75, 3),
    new NumberKeyframe(1, 1),
  ]);
}

function makeVectorCurve() {
  return new Curve([
    new Vector3Keyframe(0, { x: 0, y: 1, z: 2 }),
    new Vector3Keyframe(0.33, { x: 5, y: -2, z: 8 }),
    new Vector3Keyframe(0.66, { x: -1, y: 4, z: 3 }),
    new Vector3Keyframe(1, { x: 2, y: 0, z: 6 }),
  ]);
}

function makeColorCurve() {
  return new Curve([
    new RGBColorKeyframe(0, { r: 20, g: 40, b: 200 }),
    new RGBColorKeyframe(0.4, { r: 220, g: 80, b: 30 }),
    new RGBColorKeyframe(0.8, { r: 80, g: 200, b: 160 }),
    new RGBColorKeyframe(1, { r: 240, g: 240, b: 255 }),
  ]);
}

function makeObjectCurve() {
  const fields = (start) => Object.fromEntries(
    Array.from({ length: 64 }, (_, i) => [`field${start + i}`, i + 1]),
  );
  return Curve.objectBuilder(fields(0), fields(32));
}

function makeComposedCurve() {
  const curve = makeNumericCurve();
  curve.addModifier(new Modifiers.Number.Sine(SineModifierBlendMode.Add, 0.25, 0.2));
  curve.addModifier(new Modifiers.Number.Sine(SineModifierBlendMode.MultiplyPositive, 0.1, 0.125, 0.05));
  curve.addModifier(new Modifiers.Number.Clamp(-2, 4));
  return curve;
}

const numericCurve = makeNumericCurve();
const vectorCurve = makeVectorCurve();
const colorCurve = makeColorCurve();
const objectCurve = makeObjectCurve();
const composedCurve = makeComposedCurve();

const cases = [
  {
    name: 'constant-number-baseline',
    run: (i) => 42 + (i & 0),
  },
  {
    name: 'simple-function-baseline',
    run: (i) => {
      const t = (i % 1000) / 1000;
      return 3 + (7 - 3) * t;
    },
  },
  {
    name: 'numeric-keyframe-curve',
    run: (i) => numericCurve.evaluate((i % 1000) / 1000),
  },
  {
    name: 'vector3-like-curve',
    run: (i) => numberFromValue(vectorCurve.evaluate((i % 1000) / 1000)),
  },
  {
    name: 'color-like-curve',
    run: (i) => numberFromValue(colorCurve.evaluate((i % 1000) / 1000)),
  },
  {
    name: 'curve-with-modifiers-composition',
    run: (i) => composedCurve.evaluate((i % 1000) / 1000),
  },
  {
    name: 'object-keyframe-curve',
    run: (i) => {
      const value = objectCurve.evaluate((i % 1000) / 1000);
      return (value.field0 ?? 0) + value.field32 + (value.field95 ?? 0);
    },
  },
];

for (const benchmarkCase of cases) {
  benchmarkCase.run(0);
}

for (const benchmarkCase of cases) {
  const { totalMs, checksum } = timeFor(EVALUATIONS, benchmarkCase.run);
  emitRow(benchmarkCase.name, EVALUATIONS, totalMs, checksum);
}
