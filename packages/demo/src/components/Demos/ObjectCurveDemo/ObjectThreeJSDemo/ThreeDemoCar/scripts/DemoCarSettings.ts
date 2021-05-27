import { RGBColor } from 'curves';

export interface DemoCarSettings {
    color?: string | RGBColor;

    suspension?: number;
    wheelSpeed?: number;
    windowDown?: {
        left?: number;
        right?: number;
    };

    lights?: {
        front?: boolean;
        rear?: boolean;
        interior?: boolean;
    }

    objectData?: object;
}
