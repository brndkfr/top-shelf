import { useEffect, useRef } from 'react';
import { FloorballBoard as CoreBoard } from '../core/FloorballBoard.js';

export function FloorballBoard({
  lang       = 'en',
  tokenSize  = 50,
  home,
  away,
  players,
  opponents,
  layers,
  onTokenMoved,
  onTokenRotated,
  onGoalSwitched,
  style,
  className,
}) {
  const mountRef = useRef(null);
  const boardRef = useRef(null);
  const initOpts = useRef({ lang, tokenSize, home, away, players, opponents, layers });

  // Mount once — initial prop values captured via ref to keep deps array clean
  useEffect(() => {
    const board = new CoreBoard(mountRef.current, initOpts.current);
    boardRef.current = board;
    return () => board.destroy();
  }, []);

  // Forward prop changes to the board instance after mount
  useEffect(() => { boardRef.current?.setLang(lang); },            [lang]);
  useEffect(() => { boardRef.current?.setTokenSize(tokenSize); },  [tokenSize]);
  useEffect(() => { boardRef.current?.setTeams(home, away); },     [home, away]);
  useEffect(() => { if (players)   boardRef.current?.setPlayers(players); },   [players]);
  useEffect(() => { if (opponents) boardRef.current?.setOpponents(opponents); }, [opponents]);

  const layerRink  = layers?.rink;
  const layerZones = layers?.zones;
  useEffect(() => { if (layerRink  !== undefined) boardRef.current?.setLayer('rink',  layerRink);  }, [layerRink]);
  useEffect(() => { if (layerZones !== undefined) boardRef.current?.setLayer('zones', layerZones); }, [layerZones]);

  // Wire callbacks (stable refs recommended — wrap in useCallback on the call site)
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    if (onTokenMoved)   board.on('tokenMoved',   onTokenMoved);
    if (onTokenRotated) board.on('tokenRotated',  onTokenRotated);
    if (onGoalSwitched) board.on('goalSwitched',  onGoalSwitched);
    return () => {
      if (onTokenMoved)   board.off('tokenMoved',   onTokenMoved);
      if (onTokenRotated) board.off('tokenRotated',  onTokenRotated);
      if (onGoalSwitched) board.off('goalSwitched',  onGoalSwitched);
    };
  }, [onTokenMoved, onTokenRotated, onGoalSwitched]);

  return <div ref={mountRef} style={style} className={className} />;
}
