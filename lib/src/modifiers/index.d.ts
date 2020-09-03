declare const Modifiers: {
    Number: {
        Clamp: typeof import("./number/Clamp").default;
        Noise: typeof import("./number/Noise").default;
        Sine: typeof import("./number/Sine").default;
        Step: typeof import("./number/Step").default;
    };
    HSV: {
        Clamp: typeof import("./hsv/Clamp").default;
        Noise: typeof import("./hsv/Noise").default;
        Sine: typeof import("./hsv/Sine").default;
        Step: typeof import("./hsv/Step").default;
    };
    RGB: {
        Clamp: typeof import("./rgb/Clamp").default;
        Noise: typeof import("./rgb/Noise").default;
        Sine: typeof import("./rgb/Sine").default;
        Step: typeof import("./rgb/Step").default;
    };
    List: {
        Clamp: typeof import("./list/Clamp").default;
        Noise: typeof import("./list/Noise").default;
        Sine: typeof import("./list/Sine").default;
        Step: typeof import("./list/Step").default;
    };
    Boolean: {
        Noise: typeof import("./boolean/Noise").default;
        Sine: typeof import("./boolean/Sine").default;
    };
    Vector3: {
        Clamp: typeof import("./vector3/Clamp").default;
        Noise: typeof import("./vector3/Noise").default;
        Sine: typeof import("./vector3/Sine").default;
        Step: typeof import("./vector3/Step").default;
    };
    String: {
        Ranges: typeof import("./string/Ranges").default;
        Exclude: typeof import("./string/Exclude").default;
    };
    Object: {
        Aggregate: typeof import("./object/Aggregate").default;
    };
    Any: {
        Cycles: typeof import("./any/Cycles").default;
    };
};
export default Modifiers;
