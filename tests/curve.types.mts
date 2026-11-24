import { Easing } from 'eaz';
import Curve, { BezierKeyframe, Curve as NamedCurve, EndBehavior, Modifiers, NumberKeyframe, ObjectKeyframe } from 'curves';

function expectType<T>(_value: T): void {}

function sample<T>(evaluate: (time: number, modifierStop?: number) => T): T {
  return evaluate(0.5, 0);
}

const numeric = new Curve([new NumberKeyframe(0, 0), new NumberKeyframe(1, 8)]);
const evaluate = numeric.evaluate;
expectType<number>(numeric(0.5));
expectType<number>(numeric(0.5, 0));
expectType<number>(numeric.evaluate(0.5));
expectType<number>(evaluate(0.5));
expectType<number>(sample(numeric));
expectType<number>(sample(evaluate));

const casted = numeric.cast((value) => ({ label: value.toFixed() }));
expectType<string>(casted(0.5).label);
expectType<string>(casted.evaluate(0.5, 0).label);
expectType<string>(sample(casted).label);
expectType<number>(casted.source(0.5));
expectType<NumberKeyframe>(casted.keys[0]);
casted.addModifier(new Modifiers.Number.Clamp(0, 1));

// @ts-expect-error The source reference is read-only.
casted.source = numeric;
// @ts-expect-error The casted view has an object return type.
expectType<number>(casted(0.5));

const colors = NamedCurve.increaseColor();
expectType<number>(sample(colors).r);
expectType<number>(sample(colors.evaluate).g);
expectType<boolean>(NamedCurve.booleanBuilder(false, true)(0.5));

const map = new Curve({ 0: 0, 0.5: [8, Easing.linear], 2: 12 });
expectType<number>(map(0.5));
expectType<number>(new Curve({
  0: 0,
  1: [8, Easing.linear],
  modifiers: [new Modifiers.Number.Clamp(0, 4)],
  endBehavior: EndBehavior.Loop,
  smoothing: 0,
})(0.5));
expectType<number>(new Curve({ 0: [0, Easing.linear], 1: [8, Easing.linear] })(0.5));
expectType<string>(new Curve({ 0: 'a', 1: ['b', Easing.linear] })(0.5));
expectType<boolean>(new Curve({ 0: false, 1: true })(0.5));
expectType<number[]>(new Curve<number[]>({ 0: [1, 2], 1: [[3, 4], Easing.linear] })(0.5));
expectType<number>(new Curve({ '-0.5': { x: 0, y: 0, z: 0 }, 1: { x: 2, y: 3, z: 4 } })(0.5).x);
expectType<object>(new Curve({ keyframe: ObjectKeyframe, 0: { x: 0, y: 0, z: 0, size: 1 } })(0));
expectType<number>(new Curve({ keyframe: NumberKeyframe, 0: [0, Easing.linear], 1: 8 })(0.5));
expectType<number>(new Curve({ keyframe: BezierKeyframe, 0: 0, 1: 1 })(0.5));
expectType<number>(NamedCurve.decreaseFloat(Easing.linear)(0.5));
expectType<number>(NamedCurve.increaseColor(Easing.linear)(0.5).g);

class AdjustedCurve extends Curve<number> {
  offset = 1;

  override evaluate(time: number, modifierStop?: number): number {
    return super.evaluate(time, modifierStop) + this.offset;
  }
}

expectType<number>(new AdjustedCurve()(0.5));
const adjusted = new AdjustedCurve().cast((value) => value.toFixed());
expectType<number>(adjusted.offset);
expectType<AdjustedCurve>(adjusted.source);

// @ts-expect-error The callback retains the inferred numeric return type.
expectType<string>(sample(numeric));
// @ts-expect-error Time is required and must be numeric.
numeric('0.5');
// @ts-expect-error modifierStop must be numeric when supplied.
numeric(0.5, '0');
