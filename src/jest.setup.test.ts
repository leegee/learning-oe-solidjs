import { MockT } from "../jest.setup";

describe('MockT', () => {
    it('returns the input key as-is', () => {
        const input = 'some.translation.key';
        const result = MockT(input);
        expect(result).toBe(input);
    });

    it('ignores second argument and still returns the key', () => {
        const input = 'another.key';
        const result = MockT(input, { defaultValue: 'fallback' });
        expect(result).toBe(input);
    });
});
