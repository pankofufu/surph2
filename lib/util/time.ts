
export const r2s = (num: number) => { return Math.floor(num / 1000) }; // ms timestamp -> s timestamp
export const now = () => { return r2s(Math.floor(performance.timeOrigin + performance.now())) };