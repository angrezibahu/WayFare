import { describe, it, expect } from 'vitest';
import { moonPhase, moonPhaseName, sunriseSunset } from './astronomy';

describe('moonPhase', () => {
  it('is approximately full near a known full moon (2026-01-03)', () => {
    const p = moonPhase(new Date('2026-01-03T12:00:00Z'));
    expect(Math.abs(p - 0.5)).toBeLessThan(0.05);
    expect(moonPhaseName(p)).toBe('Full Moon');
  });
});

describe('sunriseSunset', () => {
  it('returns sensible times for London in June', () => {
    const { sunrise, sunset } = sunriseSunset(new Date('2026-06-21'), 51.5, -0.12);
    expect(sunrise).not.toBeNull();
    expect(sunset).not.toBeNull();
    // London sunrise on the solstice is ~04:43 UTC, sunset ~20:21 UTC
    expect(sunrise!.getUTCHours()).toBeLessThanOrEqual(5);
    expect(sunset!.getUTCHours()).toBeGreaterThanOrEqual(19);
  });
});
