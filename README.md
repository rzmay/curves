# Curves

##### 📈 Easily define and evaluate eased curves, similar to Unity's AnimationCurves with modifiers akin to Blender's FCurve Modifiers.

Installation:
```npm i curves```

#### [npm](https://www.npmjs.com/package/curves) ![npmlogo](https://raw.githubusercontent.com/npm/logos/master/npm%20square/npm-16.png)
#### [documentation](http://robertzmay.com/curves-documentation/) 📖

---

### Easily Define and Evaluate Curves

Constructing curves is simple, and evaluating them is even simpler.

```typescript
import { Curve, NumberKeyframe } from 'curves';

const curve: Curve<number> = new Curve<number>(
    [
        new NumberKeyframe(0, 0),
        new NumberKeyframe(1, 2),
        new NumberKeyframe(5, 1),
    ], // Keyframes
);

// Expected output: 
//    time: 0, value: 0
//    time: 1, value: 2
//    time: 2, value: 1.9375
//    time: 3, value: 1.5
//    time: 4, value: 1.0625
//    time: 5, value: 1
for (let i = 0; i < 5; i += 1) {
    console.log(`time: ${i}, value: ${curve.evaluate(i)}`)
}
```

### Interpolate With Any Type

Curves and keyframes are generic, with 9 built-in type implementations and unlimited potential for more.

```typescript
import { 
    NumberKeyframe,
    StringKeyframe,
    BooleanKeyframe,
    RGBColorKeyframe,
    Vector3Keyframe
} from 'curves';

const numberKeyframe = new NumberKeyframe(0, 4);
const stringKeyframe = new StringKeyframe(1, "Hello world!");
const boolKeyframe = new BooleanKeyframe(2, true);
const colorKeyframe = new RGBColorKeyframe(3, {
    r: 255,
    g: 125,
    b: 0,
});
const vectorKeyframe = new Vector3Keyframe(4, {
    x: 1,
    y: 4,
    z: 0,
});
```

### Add Modifiers to your Curve

Modifiers of any type are easy to create and add to your curve.

```typescript
import { Curve, Modifiers } from 'curves';

// Define the curve using a builder
const curve: Curve<number> = Curve.builder<number>(
    NumberKeyframe,
    0,
    10,
    5,
);

// Add layered noise modifiers
curve.addModifier(new Modifiers.Number.Noise(0.1, 0.5));
curve.addModifier(new Modifiers.Number.Noise(0.025, 2));

// Add a clamp modifier
curve.addModifier(new Modifiers.Number.Clamp(0, 10));
```