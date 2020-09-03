import { CurveModifier } from '../../../index';
declare class Exclude extends CurveModifier<string> {
    blacklist: string[];
    useWhitelist: boolean;
    clamp: boolean;
    constructor(blacklist: string[], useWhitelist?: boolean, clamp?: boolean, rangeStart?: number | undefined, rangeEnd?: number | undefined);
    protected _modify(value: string, time: number): string;
}
export default Exclude;
