import Curve, { CurveModifier, Keyframe } from '../../../index';

class Exclude extends CurveModifier<string> {
    blacklist: string[];
    useWhitelist: boolean; // Treat the blacklist as a whitelist?
    clamp: boolean; // Should values inside of the blacklist be clamped? or should they be excluded?

    constructor(
      blacklist: string[],
      useWhitelist = false,
      clamp = true,
      rangeStart: number | undefined = undefined,
      rangeEnd: number | undefined = undefined,
    ) {
      super(rangeStart, rangeEnd);

      this.blacklist = blacklist
        .map((c) => c.toLowerCase())
        .concat(
          blacklist.map((c) => c.toUpperCase()),
        );
      this.useWhitelist = useWhitelist;
      this.clamp = clamp;
    }

    protected _modify(value: string, time: number): string {
      let result = '';
      value.split('').forEach((character) => {
        if (this.useWhitelist === this.blacklist.includes(character)) {
          result += character;
        } else if (this.clamp) {
          if (this.useWhitelist) {
            // Get nearest character in whitelist
            const nearest = this.blacklist
              .map((c) => c.charCodeAt(0))
              .reduce((closest, current) => {
                const code = character.charCodeAt(0);
                return Math.abs(closest - code) < Math.abs(current - code) ? closest : current;
              });
            result += String.fromCharCode(nearest);
          } else {
            // Get nearest non-blacklisted character
            let nearest = '';
            let interval = 1;
            while (nearest === '') {
              const forward = String.fromCharCode(character.charCodeAt(0) + interval);
              const backward = String.fromCharCode(character.charCodeAt(0) - interval);

              if (!this.blacklist.includes(forward)) {
                nearest = forward;
              } else if (!this.blacklist.includes(backward)) {
                nearest = backward;
              } else {
                interval += 1;
              }
            }

            result += nearest;
          }
        }
      });

      return result;
    }
}

export default Exclude;
