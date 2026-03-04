import { sanitizeArtifact } from '../src/utils/helpers';

describe('sanitizeArtifact helper', () => {
  it('should replace hyphens with underscores', () => {
    expect(sanitizeArtifact('carlos-api')).toBe('carlos_api');
    expect(sanitizeArtifact('my-super-artifact')).toBe('my_super_artifact');
  });

  it('should return empty string for undefined/null/empty', () => {
    expect(sanitizeArtifact('')).toBe('');
    expect(sanitizeArtifact(null as any)).toBe('');
    expect(sanitizeArtifact(undefined as any)).toBe('');
  });

  it('should leave already safe names unchanged', () => {
    expect(sanitizeArtifact('normalName')).toBe('normalName');
    expect(sanitizeArtifact('with_underscore')).toBe('with_underscore');
  });
});
