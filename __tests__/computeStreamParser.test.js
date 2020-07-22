import computeParse from '../src/core/utils/computeParser';

describe('computeStreamParser', () => {
  it('if "text/event-stream" is passed to the parser, returns "stream" type', () => {
    const contentTypeHeader = 'text/event-stream';
    const res = computeParse(contentTypeHeader, null);
    expect(res).toBe('stream');
  });
});
