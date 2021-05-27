import React from 'react';

export interface KeyframeValueInputProps<T> {
    defaultValue: T;
    onChange: (value: T) => void;
}
