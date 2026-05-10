import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { FloorballBoard } from './FloorballBoard.jsx';

let mockInstance;

vi.mock('../core/FloorballBoard.js', () => ({
  FloorballBoard: vi.fn().mockImplementation(() => {
    mockInstance = {
      setLang:      vi.fn(),
      setTokenSize: vi.fn(),
      setTeams:     vi.fn(),
      setPlayers:   vi.fn(),
      setOpponents: vi.fn(),
      setLayer:     vi.fn(),
      on:           vi.fn(),
      off:          vi.fn(),
      destroy:      vi.fn(),
    };
    return mockInstance;
  }),
}));

describe('FloorballBoard (React)', () => {
  it('renders a container div', () => {
    const { container } = render(<FloorballBoard />);
    expect(container.firstChild).not.toBeNull();
  });

  it('calls setLang when lang prop changes', () => {
    const { rerender } = render(<FloorballBoard lang="en" />);
    rerender(<FloorballBoard lang="de" />);
    expect(mockInstance.setLang).toHaveBeenCalledWith('de');
  });

  it('calls setTokenSize when tokenSize prop changes', () => {
    const { rerender } = render(<FloorballBoard tokenSize={50} />);
    rerender(<FloorballBoard tokenSize={70} />);
    expect(mockInstance.setTokenSize).toHaveBeenCalledWith(70);
  });

  it('calls setTeams when home prop changes', () => {
    const { rerender } = render(<FloorballBoard />);
    const home = { color: '#ff0000', accent: '#ffffff' };
    rerender(<FloorballBoard home={home} />);
    expect(mockInstance.setTeams).toHaveBeenCalledWith(home, undefined);
  });

  it('calls setPlayers when players prop changes', () => {
    const { rerender } = render(<FloorballBoard />);
    const players = [{ id: 'p1', x: 100, y: 100 }];
    rerender(<FloorballBoard players={players} />);
    expect(mockInstance.setPlayers).toHaveBeenCalledWith(players);
  });

  it('calls setOpponents when opponents prop changes', () => {
    const { rerender } = render(<FloorballBoard />);
    const opponents = [{ id: 'o1', x: 800, y: 300 }];
    rerender(<FloorballBoard opponents={opponents} />);
    expect(mockInstance.setOpponents).toHaveBeenCalledWith(opponents);
  });

  it('calls setLayer when layers.rink prop changes', () => {
    const { rerender } = render(<FloorballBoard layers={{ rink: true, zones: true }} />);
    rerender(<FloorballBoard layers={{ rink: false, zones: true }} />);
    expect(mockInstance.setLayer).toHaveBeenCalledWith('rink', false);
  });

  it('wires event callbacks on mount and removes them on unmount', () => {
    const onTokenMoved = vi.fn();
    const { unmount } = render(<FloorballBoard onTokenMoved={onTokenMoved} />);
    expect(mockInstance.on).toHaveBeenCalledWith('tokenMoved', onTokenMoved);
    unmount();
    expect(mockInstance.off).toHaveBeenCalledWith('tokenMoved', onTokenMoved);
  });

  it('calls destroy on unmount', () => {
    const { unmount } = render(<FloorballBoard />);
    unmount();
    expect(mockInstance.destroy).toHaveBeenCalled();
  });
});
