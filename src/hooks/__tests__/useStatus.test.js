import { renderHook, act } from '@testing-library/react';
import useStatus from '../useStatus';

jest.useFakeTimers();

describe('useStatus custom hook', () => {
  test('should initialize with default status "idle"', () => {
    const { result } = renderHook(() => useStatus());

    expect(result.current.status).toBe('idle');
  });

  test('should allow updating status', () => {
    const { result } = renderHook(() => useStatus());

    act(() => {
      result.current.setStatus('loading');
    });

    expect(result.current.status).toBe('loading');
  });

  test('should reset to "idle" after 10 seconds if status changes', () => {
    const { result } = renderHook(() => useStatus());

    act(() => {
      result.current.setStatus('success');
    });

    expect(result.current.status).toBe('success');

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.status).toBe('idle');
  });

  test('should clear timeout when unmounted', () => {
    jest.spyOn(global, 'clearTimeout');
    const { result, unmount } = renderHook(() => useStatus());

    act(() => {
      result.current.setStatus('error');
    });

    unmount();

    expect(global.clearTimeout).toHaveBeenCalled();

    jest.restoreAllMocks();
  });
});
