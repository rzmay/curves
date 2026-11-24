import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';
import { Easing } from 'eaz';
import Curve, {
  BezierKeyframe,
  CurveModifier,
  EndBehavior,
  HSVColorKeyframe,
  ListKeyframe,
  Modifiers,
  NumberKeyframe,
  ObjectKeyframe,
  RGBColorKeyframe,
  Vector3Keyframe,
} from 'curves';

function assertEvaluation(curve, evaluate, time, expected, ...modifierStop) {
  assert.equal(curve(time, ...modifierStop), expected);
  assert.equal(curve.evaluate(time, ...modifierStop), expected);
  assert.equal(evaluate(time, ...modifierStop), expected);
}

test('calls and detached evaluators use the current curve state', () => {
  const curve = Curve.floatBuilder(0, 8);
  const evaluate = curve.evaluate;

  assert.ok(curve instanceof Curve);
  assert.equal(curve.evaluate, evaluate);
  assertEvaluation(curve, evaluate, 0.5, 4);
  assertEvaluation(curve, evaluate, 1.5, 8);
  assert.equal(curve.call(null, 0.5), 4);
  assert.equal(curve.bind(null)(0.5), 4);
  Object.defineProperty(curve, 'call', { configurable: true, value: undefined });
  assert.equal(curve.call, undefined);
  delete curve.call;
  assert.equal(curve.call(null, 0.5), 4);

  curve.endBehaviour = EndBehavior.Loop;
  assertEvaluation(curve, evaluate, 1.5, 4);
  curve.endBehaviour = EndBehavior.PingPong;
  assertEvaluation(curve, evaluate, 2, 0);

  curve.addKeyframe(new NumberKeyframe(2, 16));
  curve.shiftPhase(1);
  assert.equal(curve.startTime, 1);
  assert.equal(curve.endTime, 3);
  assertEvaluation(curve, evaluate, 2.5, 12);

  curve.keys = [new NumberKeyframe(0, 20), new NumberKeyframe(1, 40)];
  curve.update();
  assertEvaluation(curve, evaluate, 0.5, 30);
});

test('modifier callbacks receive the callable curve and respect modifierStop', () => {
  const instances = [];
  class Clamp extends CurveModifier {
    configure(curve) {
      instances.push(curve);
    }

    evaluate(curve, value, time) {
      instances.push(curve);
      return super.evaluate(curve, value, time);
    }

    _modify(value) {
      return Math.min(value, 1);
    }
  }

  const curve = new Curve([new NumberKeyframe(0, 0), new NumberKeyframe(1, 8)], [new Clamp()]);
  const evaluate = curve.evaluate;
  curve.addModifier(new Modifiers.Number.Step(2));
  assertEvaluation(curve, evaluate, 0.5, 0);
  assertEvaluation(curve, evaluate, 0.5, 4, 0);
  assertEvaluation(curve, evaluate, 0.5, 1, 1);
  assertEvaluation(curve, evaluate, 0.5, 0, 10);
  assert.ok(instances.length > 0);
  assert.ok(instances.every((instance) => instance === curve));

  const cycles = Curve.floatBuilder(0, 8);
  cycles.addModifier(new Modifiers.Number.Step(3));
  cycles.addModifier(new Modifiers.Any.Cycles(0, 0.5));
  assertEvaluation(cycles, cycles.evaluate, 0.5, 0);
  assertEvaluation(cycles, cycles.evaluate, 0.5, 3, 1);
});

test('casted evaluation shares source state and converts results through every call form', () => {
  const source = Curve.floatBuilder(0, 8, 1, Easing.linear);
  const view = source.cast((value) => `value ${value}`);
  const evaluate = view.evaluate;
  assert.ok(view instanceof Curve);
  assert.equal(view.constructor, Curve);
  assert.equal(view.source, source);
  assert.equal(view.keys, source.keys);
  assert.equal(Object.keys(view).includes('keys'), false);
  assert.equal(view.valueOf(), view);
  assert.equal(view.evaluate, evaluate);
  assertEvaluation(view, evaluate, 0.5, 'value 4');
  assert.equal(view.call(null, 0.5), 'value 4');
  assert.equal(view.apply(null, [0.5]), 'value 4');
  assert.equal(view.bind(null)(0.5), 'value 4');
  assert.equal(source(0.5), 4);
  assert.equal('source' in view, true);
  assert.equal(Reflect.set(view, 'source', Curve.increaseFloat()), false);
  Object.defineProperty(view, 'tag', { value: 'local', configurable: true });
  assert.equal(view.tag, 'local');
  assert.equal(view.hasOwnProperty('tag'), true);
  assert.equal('tag' in source, false);
  delete view.tag;
  assert.equal(view.tag, undefined);

  view.endBehaviour = EndBehavior.Loop;
  assert.equal(source.endBehaviour, EndBehavior.Loop);
  view.addKeyframe(new NumberKeyframe(2, 16, Easing.linear));
  assert.equal(source.duration, 2);
  assertEvaluation(view, evaluate, 1.5, 'value 12');
  source.shiftPhase(1);
  assertEvaluation(view, evaluate, 2.5, 'value 12');

  const independent = view.cast((value) => value * 2);
  assert.equal(independent.source, source);
  assert.equal(independent(2.5), 24);
  assert.equal(view(2.5), 'value 12');
});

test('a frozen source still supports casted evaluation', () => {
  const source = Object.freeze(Curve.increaseFloat());
  const view = source.cast((value) => `value ${value}`);
  assert.equal(view.evaluate(1), 'value 1');
  assert.equal(view.source, source);
  assert.equal(view.keys, source.keys);
});

test('casted views give modifiers the original curve and convert only the outer result', () => {
  const source = Curve.floatBuilder(0, 8, 1, Easing.linear);
  const configured = [];
  let conversions = 0;
  const view = source.cast((value) => {
    conversions += 1;
    return `value ${value}`;
  });

  class AddOne extends CurveModifier {
    configure(curve) {
      configured.push(curve);
    }

    evaluate(curve, value, time) {
      assert.equal(curve, source);
      return super.evaluate(curve, value, time);
    }

    _modify(value) {
      return value + 1;
    }
  }

  view.addModifier(new AddOne());
  view.addModifier(new Modifiers.Any.Cycles(0, 0.5));
  assert.deepEqual(configured, [source, source]);
  assert.equal(view(0.75), 'value 3');
  assert.equal(conversions, 1);
  assert.equal(source.evaluate(0.75), 3);
  assert.equal(conversions, 1);
  assertEvaluation(view, view.evaluate, 0.75, 'value 7', 1);
});

test('subclass overrides and accessors use the returned instance', () => {
  class AdjustedCurve extends Curve {
    #offset = 2;

    get offset() {
      return this.#offset;
    }

    set offset(value) {
      this.#offset = value;
    }

    evaluate(time, modifierStop) {
      return super.evaluate(time, modifierStop) + this.#offset;
    }

    setName(name) {
      this.name = name;
      return this;
    }

    length() {
      return this.#offset;
    }
  }

  const curve = new AdjustedCurve([new NumberKeyframe(0, 0), new NumberKeyframe(1, 8)]);
  const evaluate = curve.evaluate;
  assert.ok(curve instanceof AdjustedCurve);
  assert.ok(curve instanceof Curve);
  assert.equal(Object.getPrototypeOf(curve), AdjustedCurve.prototype);
  assert.equal(curve.constructor, AdjustedCurve);
  assert.equal(curve.setName('adjusted'), curve);
  assert.equal(curve.name, 'adjusted');
  assertEvaluation(curve, evaluate, 0.5, 6);

  curve.offset = 6;
  assert.equal(curve.offset, 6);
  assertEvaluation(curve, evaluate, 0.5, 10);

  const casted = curve.cast((value) => `value ${value}`);
  assert.ok(casted instanceof AdjustedCurve);
  assert.equal(casted.offset, 6);
  casted.offset = 8;
  assert.equal(curve.offset, 8);
  assert.equal(casted.setName('casted'), curve);
  assert.equal(curve.name, 'casted');
  assert.equal(casted.name, 'casted');
  assert.equal(casted.length(), 8);
  assertEvaluation(casted, casted.evaluate, 0.5, 'value 12');
});

test('CommonJS exports callable curves', () => {
  const require = createRequire(import.meta.url);
  const { Curve: CommonJSCurve } = require('curves');
  const curve = CommonJSCurve.increaseFloat();
  assert.ok(curve instanceof CommonJSCurve);
  assertEvaluation(curve, curve.evaluate, 1, 1);
  assert.equal(curve.cast(String)(1), '1');
  assert.equal(new CommonJSCurve({ 0: [0, Easing.linear], 1: [8, Easing.linear] })(0.25), 2);
});

test('timestamp shorthand sorts numeric times and unpacks optional easing', () => {
  const curve = new Curve({ 1: [8, Easing.linear], '-0.5': 0, '5e-1': [4, Easing.linear] });
  assert.deepEqual(curve.keys.map((key) => key.time), [-0.5, 0.5, 1]);
  assert.equal(curve.keys[0].inEasing, Easing.cubic);
  assert.equal(curve.keys[1].inEasing, Easing.linear);
  assert.equal(curve.keys[1].outEasing, Easing.linear);
  assert.equal(curve(0.75), 6);

  const list = new Curve({ 0: [0, 2], 1: [[2, 4], Easing.linear] });
  assert.ok(list.keys[0] instanceof ListKeyframe);
  assert.deepEqual(list(0.5), [1, 3]);
  assert.equal(new Curve({ 0: false, 1: true })(0.5), false);
  assert.equal(new Curve({ 0: 'a', 1: 'c' })(0.5), 'b');
});

test('timestamp shorthand accepts curve options and allows positional overrides', () => {
  const settings = {
    0: [0, Easing.linear],
    1: [8, Easing.quadratic],
    modifiers: [new Modifiers.Number.Clamp(0, 1)],
    endBehavior: EndBehavior.Loop,
    smoothing: 0,
  };
  const curve = new Curve(settings);
  assert.deepEqual(curve.keys.map((key) => key.time), [0, 1]);
  assert.equal(curve.modifiers, settings.modifiers);
  assert.equal(curve(1.25), 1);
  assert.equal(curve(1.25, 0), 2);

  const overridden = new Curve(settings, [], EndBehavior.Clamp, 0.5);
  assert.equal(overridden.smoothing, 0.5);
  assert.equal(overridden(1.25), 8);
  assert.equal(new Curve(settings, undefined, EndBehavior.Clamp).modifiers, settings.modifiers);
});

test('shorthand recognizes compound values and honors an explicit constructor', () => {
  const first = { x: 0, y: 0, z: 0, size: 0 };
  const last = { x: 2, y: 4, z: 6, size: 2 };
  const inferred = new Curve({ 0: first, 1: last });
  assert.ok(inferred.keys[0] instanceof Vector3Keyframe);
  assert.deepEqual(inferred(0.5), { x: 1, y: 2, z: 3 });

  const override = new Curve({ keyframe: ObjectKeyframe, 0: first, 1: last });
  assert.ok(override.keys[0] instanceof ObjectKeyframe);
  assert.deepEqual(override(0.5), { x: 1, y: 2, z: 3, size: 1 });
  assert.ok(new Curve({ 0: { r: 1, g: 1, b: 1 } }).keys[0] instanceof RGBColorKeyframe);
  assert.ok(new Curve({ 0: { h: 1, s: 1, v: 1 } }).keys[0] instanceof HSVColorKeyframe);
  assert.ok(new Curve({ keyframe: BezierKeyframe, 0: 0, 1: 1 }).keys[0] instanceof BezierKeyframe);

  class CustomKeyframe extends NumberKeyframe {
    constructor(time, value, easing = Easing.sinusoidal) {
      super(time, value, easing);
    }
  }
  const custom = new Curve({ keyframe: CustomKeyframe, 0: 0, 1: [1, Easing.linear] });
  assert.equal(custom.keys[0].inEasing, Easing.sinusoidal);
  assert.equal(custom.keys[1].inEasing, Easing.linear);
});

test('shorthand chooses a common keyframe type across all values', () => {
  const vector = { x: 2, y: 4, z: 6 };
  const rgb = { r: 80, g: 120, b: 160 };
  const mixed = new Curve({ 0: vector, 1: [rgb, Easing.linear] });
  assert.ok(mixed.keys.every((key) => key instanceof ObjectKeyframe));
  assert.deepEqual(mixed(0.5), { x: 1, y: 2, z: 3, r: 40, g: 60, b: 80 });

  const common = new Curve({ 0: { ...vector, ...rgb }, 1: rgb });
  assert.ok(common.keys.every((key) => key instanceof RGBColorKeyframe));
  assert.deepEqual(common(0.5), rgb);
});

test('object interpolation visits overlapping fields once in first-seen order', () => {
  const curve = Curve.objectBuilder({ z: 0, shared: 2, left: 4 }, { shared: 6, right: 8, z: 10 });
  const value = curve(0.5);
  assert.deepEqual(Object.keys(value), ['z', 'shared', 'left', 'right']);
  assert.deepEqual(value, { z: 5, shared: 4, left: 2, right: 4 });
});

test('convenience constructors keep their defaults and accept optional easing', () => {
  assert.equal(Curve.increaseFloat()(0.25), Curve.floatBuilder(0, 1)(0.25));
  assert.equal(Curve.increaseFloat(Easing.linear)(0.25), 0.25);
  assert.equal(Curve.decreaseFloat(Easing.linear)(0.25), 0.75);
  assert.equal(Curve.increaseColor(Easing.linear)(0.25).r, 63.75);
  assert.equal(Curve.decreaseColor(Easing.linear)(0.25).r, 191.25);
});

test('direct vector interpolation retains its default smoothing and conversion overrides', () => {
  const first = new Vector3Keyframe(0, { x: 0, y: 1, z: 2 }, Easing.cubic);
  const last = new Vector3Keyframe(1, { x: 3, y: 4, z: 5 }, Easing.linear);
  const curve = new Curve([first, last], [], EndBehavior.Clamp, 0);
  const from = first.toFloatKeyframe();
  const to = last.toFloatKeyframe();
  const time = 0.3;
  assert.deepEqual(curve(time), {
    x: from[0].interpolate(to[0], time),
    y: from[1].interpolate(to[1], time),
    z: from[2].interpolate(to[2], time),
  });

  class AdjustedVector extends Vector3Keyframe {
    toFloatKeyframe() {
      const keys = super.toFloatKeyframe();
      keys[0].value = 9;
      return keys;
    }
  }

  const adjusted = new AdjustedVector(1, last.value);
  assert.equal(first.interpolate(adjusted, 0.5).x, 4.5);
});

test('list and string interpolation preserve padding, truncation, and code units', () => {
  const from = new ListKeyframe(0, [2], Easing.linear);
  const to = new ListKeyframe(1, [4, 6], Easing.linear);
  assert.deepEqual(from.interpolate(to, 0.5), [3, 3]);
  from.truncate = true;
  assert.deepEqual(from.interpolate(to, 0.5), [3]);

  const sparse = new ListKeyframe(0, [, 2], Easing.linear);
  assert.deepEqual(sparse.interpolate(to, 0.5), [2, 4]);
  sparse.truncate = true;
  assert.deepEqual(sparse.interpolate(to, 0.5), [, 4]);

  const curve = new Curve({ 0: ['😀', Easing.linear], 1: ['😁a', Easing.linear] });
  assert.equal(curve(0.5), '😁1');
});
