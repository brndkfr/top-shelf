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

  const layerRink                   = layers?.rink;
  const layerZones                  = layers?.zones;
  const layerZonesLeft              = layers?.zonesLeft;
  const layerZoneAttention          = layers?.zoneAttention;
  const layerZoneAwareness          = layers?.zoneAwareness;
  const layerZonePassing            = layers?.zonePassingFirst;
  const layerZoneDanger             = layers?.zoneDanger;
  const layerZoneSlot               = layers?.zoneSlot;
  const layerZoneAttentionRight     = layers?.zoneAttentionRight;
  const layerZoneAwarenessLeft      = layers?.zoneAwarenessLeft;
  const layerZonePassingFirstRight  = layers?.zonePassingFirstRight;
  const layerZoneDangerRight        = layers?.zoneDangerRight;
  const layerZoneSlotRight          = layers?.zoneSlotRight;
  useEffect(() => { if (layerRink                  !== undefined) boardRef.current?.setLayer('rink',                       layerRink);                  }, [layerRink]);
  useEffect(() => { if (layerZones                 !== undefined) boardRef.current?.setLayer('zones',                      layerZones);                 }, [layerZones]);
  useEffect(() => { if (layerZonesLeft             !== undefined) boardRef.current?.setLayer('zones-left',                 layerZonesLeft);             }, [layerZonesLeft]);
  useEffect(() => { if (layerZoneAttention         !== undefined) boardRef.current?.setLayer('zone-attention',             layerZoneAttention);         }, [layerZoneAttention]);
  useEffect(() => { if (layerZoneAwareness         !== undefined) boardRef.current?.setLayer('zone-awareness',             layerZoneAwareness);         }, [layerZoneAwareness]);
  useEffect(() => { if (layerZonePassing           !== undefined) boardRef.current?.setLayer('zone-passing-first',         layerZonePassing);           }, [layerZonePassing]);
  useEffect(() => { if (layerZoneDanger            !== undefined) boardRef.current?.setLayer('zone-danger',                layerZoneDanger);            }, [layerZoneDanger]);
  useEffect(() => { if (layerZoneSlot              !== undefined) boardRef.current?.setLayer('zone-slot',                  layerZoneSlot);              }, [layerZoneSlot]);
  useEffect(() => { if (layerZoneAttentionRight    !== undefined) boardRef.current?.setLayer('zone-attention-right',       layerZoneAttentionRight);    }, [layerZoneAttentionRight]);
  useEffect(() => { if (layerZoneAwarenessLeft     !== undefined) boardRef.current?.setLayer('zone-awareness-left',        layerZoneAwarenessLeft);     }, [layerZoneAwarenessLeft]);
  useEffect(() => { if (layerZonePassingFirstRight !== undefined) boardRef.current?.setLayer('zone-passing-first-right',   layerZonePassingFirstRight); }, [layerZonePassingFirstRight]);
  useEffect(() => { if (layerZoneDangerRight       !== undefined) boardRef.current?.setLayer('zone-danger-right',          layerZoneDangerRight);       }, [layerZoneDangerRight]);
  useEffect(() => { if (layerZoneSlotRight         !== undefined) boardRef.current?.setLayer('zone-slot-right',            layerZoneSlotRight);         }, [layerZoneSlotRight]);

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
