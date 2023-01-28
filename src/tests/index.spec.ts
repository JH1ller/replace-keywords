import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ReplaceKeywords from '../';

const consoleErrorSpy = vi.spyOn(console, 'error');

const getRangeMock = vi.fn(() => ({
  anchorNode: document.createElement('div'),
  getRangeAt: () => ({ startOffset: 0 }),
}));

vi.spyOn(window, 'getSelection').mockImplementation(getRangeMock as any);

describe('Replace Keywords', () => {
  afterEach(() => {
    consoleErrorSpy.mockReset();
  });

  it('warns when element is missing contenteditable', () => {
    const element = document.createElement('div');

    const rk = new ReplaceKeywords(element, { transformations: [] });

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(rk.element).not.toBeDefined();
  });

  it('attaches element', () => {
    const element = document.createElement('div');

    element.contentEditable = 'true';

    const rk = new ReplaceKeywords(element, { transformations: [] });

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(rk.element).toBeDefined();
  });

  it('detaches and attaches to different element', () => {
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');

    element1.contentEditable = 'true';
    element2.contentEditable = 'true';

    const rk = new ReplaceKeywords(element1, { transformations: [] });

    expect(rk.element).toEqual(element1);

    rk.detach();

    expect(rk.element).not.toBeDefined();

    rk.attach(element2);

    expect(rk.element).toEqual(element2);
  });
});

describe('ReplaceKeywords', () => {
  let element: HTMLElement;
  let rk: ReplaceKeywords;
  const config = {
    transformations: [
      { query: 'test', value: 'replaced', appendSpace: false },
      { query: /\d+/, value: (lastWord: string) => `Number: ${lastWord}` },
    ],
  };

  beforeEach(() => {
    element = document.createElement('div');
    element.contentEditable = 'true';
    rk = new ReplaceKeywords(element, config);
  });

  it('should attach to an element with contenteditable attribute', () => {
    expect(rk?.element).toBe(element);
  });

  it('should detach from element', () => {
    rk?.detach();
    expect(rk.element).toBeUndefined();
  });

  it('should return the transformations from config', () => {
    expect(rk.transformations).toEqual(config.transformations);
  });

  it('should set the transformations in config', () => {
    const newTransformations = [
      { query: 'test2', value: 'replaced2', appendSpace: true },
    ];
    rk.transformations = newTransformations;
    expect(rk.config.transformations).toEqual(newTransformations);
  });

  // TODO: get virtual selection working for these tests to work or write E2E tests instead
  it.skip('should replace matching keyword with value from config', () => {
    element.innerHTML = 'This is a test';
    getRangeMock.mockImplementation(() => ({
      anchorNode: element as any,
      getRangeAt: () => ({ startOffset: element.innerHTML.length }),
    }));

    element.dispatchEvent(new Event('keyup'));
    expect(element.innerHTML).toBe('This is a replaced');
  });

  it.skip('should replace matching regexp with value from config', () => {
    element.innerHTML = 'This is number 1234';
    element.dispatchEvent(new Event('keyup'));
    expect(element.innerHTML).toBe('This is number 1234Number: 1234');
  });

  it('should not replace non-matching keyword', () => {
    element.innerHTML = 'This is a sample';
    element.dispatchEvent(new Event('keyup'));
    expect(element.innerHTML).toBe('This is a sample');
  });

  it.skip('should trigger replace event', () => {
    let eventCalled = false;
    element.addEventListener('replace', () => {
      eventCalled = true;
    });
    element.innerHTML = 'This is a test';
    element.dispatchEvent(new Event('keyup'));
    expect(eventCalled).toBe(true);
  });
});
