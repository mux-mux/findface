import { renderHook, act } from '@testing-library/react';
import useOutsideClick from '../useOutsideClick';

describe('useClickOutside custom hook', () => {
  test('calls onClose when clicking outside the ref element', () => {
    const onClose = jest.fn();
    const ref = { current: document.createElement('div') };

    renderHook(() => useOutsideClick(ref, onClose));

    act(() => {
      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);
      outsideElement.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true })
      );
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('does not call onClose when clicking inside the ref element', () => {
    const onClose = jest.fn();
    const ref = { current: document.createElement('div') };

    renderHook(() => useOutsideClick(ref, onClose));

    act(() => {
      ref.current.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(onClose).not.toHaveBeenCalled();
  });
});
