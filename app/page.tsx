'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

// ── Audio synthesis ──────────────────────────────────────────────────────────

function makeNoise(ctx: OfflineAudioContext, dur: number) {
  const buf = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * dur)), ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource(); src.buffer = buf; return src
}

function kick(ctx: OfflineAudioContext, t: number, v = 1.5) {
  const o = ctx.createOscillator(), g = ctx.createGain()
  o.type = 'sine'
  o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(0.001, t + 0.45)
  g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.5)
  o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.5)
}

function snare(ctx: OfflineAudioContext, t: number, v = 1) {
  const n = makeNoise(ctx, 0.2), f = ctx.createBiquadFilter(), ng = ctx.createGain()
  f.type = 'bandpass'; f.frequency.value = 3000; f.Q.value = 0.5
  ng.gain.setValueAtTime(v, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
  n.connect(f); f.connect(ng); ng.connect(ctx.destination); n.start(t); n.stop(t + 0.2)
  const o = ctx.createOscillator(), og = ctx.createGain()
  o.type = 'sine'
  o.frequency.setValueAtTime(200, t); o.frequency.exponentialRampToValueAtTime(80, t + 0.1)
  og.gain.setValueAtTime(0.7 * v, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.1)
  o.connect(og); og.connect(ctx.destination); o.start(t); o.stop(t + 0.1)
}

function hihat(ctx: OfflineAudioContext, t: number, dur = 0.05, v = 0.4) {
  const n = makeNoise(ctx, Math.max(dur, 0.02)), f = ctx.createBiquadFilter(), g = ctx.createGain()
  f.type = 'highpass'; f.frequency.value = 8000
  g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur)
  n.connect(f); f.connect(g); g.connect(ctx.destination); n.start(t); n.stop(t + dur)
}

async function genBeat(type: 'house' | 'hiphop'): Promise<AudioBuffer> {
  const bpm = type === 'house' ? 128 : 90
  const bl = 60 / bpm, beats = 8, dur = beats * bl + 0.6
  const ctx = new OfflineAudioContext(2, Math.ceil(44100 * dur), 44100)
  if (type === 'house') {
    for (let b = 0; b < beats; b++) {
      const t = b * bl
      kick(ctx, t)
      if (b % 4 === 1 || b % 4 === 3) snare(ctx, t)
      hihat(ctx, t, 0.04, 0.5); hihat(ctx, t + bl * 0.5, 0.04, 0.3)
    }
    const o = ctx.createOscillator(), g = ctx.createGain()
    o.type = 'sine'
    ;[60,60,65,63,60,60,58,60].forEach((hz, i) => {
      const t = i * bl
      o.frequency.setValueAtTime(hz, t)
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.4, t + 0.02)
      g.gain.setValueAtTime(0.4, t + bl * 0.85); g.gain.linearRampToValueAtTime(0, t + bl * 0.9)
    })
    o.connect(g); g.connect(ctx.destination); o.start(0); o.stop(dur)
  } else {
    ;[0,1.5,4,5.5].forEach(b => kick(ctx, b * bl, 1.8))
    snare(ctx, 2 * bl); snare(ctx, 6 * bl)
    for (let i = 0; i < beats * 2; i++) hihat(ctx, i * bl * 0.5, 0.04, 0.3)
    ;[1,3,5,7].forEach(b => hihat(ctx, b * bl, 0.3, 0.4))
    const o = ctx.createOscillator(), ff = ctx.createBiquadFilter(), g = ctx.createGain()
    o.type = 'sawtooth'; ff.type = 'lowpass'; ff.frequency.value = 200
    ;[55,55,50,52,55,55,53,55].forEach((hz, i) => {
      const t = i * bl
      o.frequency.setValueAtTime(hz, t)
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.5, t + 0.02)
      g.gain.setValueAtTime(0.5, t + bl * 0.8); g.gain.linearRampToValueAtTime(0, t + bl * 0.85)
    })
    o.connect(ff); ff.connect(g); g.connect(ctx.destination); o.start(0); o.stop(dur)
  }
  return ctx.startRendering()
}

async function genPads(sr: number): Promise<Record<string, AudioBuffer>> {
  const mk = async (fn: (c: OfflineAudioContext) => void, dur: number) => {
    const c = new OfflineAudioContext(1, Math.max(1, Math.ceil(sr * dur)), sr)
    fn(c); return c.startRendering()
  }
  const [k, s, h, cl, oh, b, st] = await Promise.all([
    mk(c => kick(c, 0), 0.55),
    mk(c => snare(c, 0), 0.3),
    mk(c => hihat(c, 0, 0.05, 0.8), 0.1),
    mk(c => { for (let i = 0; i < 3; i++) hihat(c, i * 0.012, 0.08, 1) }, 0.15),
    mk(c => hihat(c, 0, 0.3, 0.6), 0.35),
    mk(c => { const o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = 80; g.gain.setValueAtTime(1,0); g.gain.exponentialRampToValueAtTime(0.001,0.4); o.connect(g); g.connect(c.destination); o.start(0); o.stop(0.4) }, 0.45),
    mk(c => { const o = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain(); o.type = 'sawtooth'; o.frequency.value = 440; f.type = 'lowpass'; f.frequency.setValueAtTime(1200,0); f.frequency.exponentialRampToValueAtTime(200,0.15); g.gain.setValueAtTime(0.8,0); g.gain.exponentialRampToValueAtTime(0.001,0.15); o.connect(f); f.connect(g); g.connect(c.destination); o.start(0); o.stop(0.15) }, 0.2),
  ])
  const rev = new AudioBuffer({ length: s.length, sampleRate: sr, numberOfChannels: 1 })
  const sd = s.getChannelData(0), rd = rev.getChannelData(0)
  for (let i = 0; i < sd.length; i++) rd[i] = sd[sd.length - 1 - i]
  return { kick: k, snare: s, hihat: h, clap: cl, openhat: oh, bass: b, stab: st, reverse: rev }
}

// ── Vinyl drawing ────────────────────────────────────────────────────────────

function drawVinyl(canvas: HTMLCanvasElement, angle: number, color: string) {
  const c = canvas.getContext('2d'); if (!c) return
  const s = canvas.width, cx = s / 2, cy = s / 2, r = s / 2 - 2
  c.clearRect(0, 0, s, s)
  c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.fillStyle = '#111'; c.fill()
  for (let i = 1; i <= 16; i++) {
    c.beginPath(); c.arc(cx, cy, r * (0.3 + 0.68 * i / 17), 0, Math.PI * 2)
    c.strokeStyle = i % 3 === 0 ? '#333' : '#1c1c1c'; c.lineWidth = 1; c.stroke()
  }
  c.save(); c.translate(cx, cy); c.rotate(angle)
  c.beginPath(); c.arc(0, 0, r * 0.28, 0, Math.PI * 2); c.fillStyle = color + '22'; c.fill()
  c.strokeStyle = color; c.lineWidth = 2; c.stroke()
  c.fillStyle = color; c.font = `bold ${Math.floor(r * 0.09)}px monospace`
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('DJMAX', 0, 0)
  c.beginPath(); c.arc(r * 0.14, 0, 3, 0, Math.PI * 2); c.fillStyle = color + 'bb'; c.fill()
  c.beginPath(); c.arc(0, 0, 3, 0, Math.PI * 2); c.fillStyle = '#000'; c.fill()
  c.restore()
}

// ── Types ────────────────────────────────────────────────────────────────────

interface Nodes {
  ctx: AudioContext; analyser: AnalyserNode; masterGain: GainNode
  aGain: GainNode; aCF: GainNode; aBass: BiquadFilterNode; aMid: BiquadFilterNode; aTreble: BiquadFilterNode
  bGain: GainNode; bCF: GainNode; bBass: BiquadFilterNode; bMid: BiquadFilterNode; bTreble: BiquadFilterNode
}

// ── Main component ───────────────────────────────────────────────────────────

export default function DJMax() {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [aPlay, setAPlay] = useState(false)
  const [bPlay, setBPlay] = useState(false)
  const [aVol, setAVol] = useState(0.8)
  const [bVol, setBVol] = useState(0.8)
  const [aPitch, setAPitch] = useState(1.0)
  const [bPitch, setBPitch] = useState(1.0)
  const [aBass, setABass] = useState(0); const [aMid, setAMid] = useState(0); const [aTreble, setATreble] = useState(0)
  const [bBass, setBBass] = useState(0); const [bMid, setBMid] = useState(0); const [bTreble, setBTreble] = useState(0)
  const [cf, setCf] = useState(0.5)
  const [master, setMaster] = useState(0.8)
  const [aName, setAName] = useState('House Beat · 128 BPM')
  const [bName, setBName] = useState('Hip-Hop Beat · 90 BPM')
  const [padActive, setPadActive] = useState<string | null>(null)
  const [aScratch, setAScratch] = useState(false)
  const [bScratch, setBScratch] = useState(false)

  const N = useRef<Nodes | null>(null)
  const aSrc = useRef<AudioBufferSourceNode | null>(null)
  const bSrc = useRef<AudioBufferSourceNode | null>(null)
  const aBuf = useRef<AudioBuffer | null>(null)
  const bBuf = useRef<AudioBuffer | null>(null)
  const aOff = useRef(0); const bOff = useRef(0)
  const aStart = useRef(0); const bStart = useRef(0)
  const padBufs = useRef<Record<string, AudioBuffer>>({})
  const aAngle = useRef(0); const bAngle = useRef(0)
  const aPlaying = useRef(false); const bPlaying = useRef(false)
  const aPR = useRef(1.0); const bPR = useRef(1.0)
  const aScratchRef = useRef(false); const bScratchRef = useRef(false)
  const aScratchX = useRef(0); const bScratchX = useRef(0)
  const vA = useRef<HTMLCanvasElement>(null)
  const vB = useRef<HTMLCanvasElement>(null)
  const vizRef = useRef<HTMLCanvasElement>(null)

  const init = useCallback(async () => {
    if (N.current || loading) return
    setLoading(true)
    const ctx = new AudioContext()
    const analyser = ctx.createAnalyser(); analyser.fftSize = 256
    const masterGain = ctx.createGain(); masterGain.gain.value = 0.8
    masterGain.connect(analyser); analyser.connect(ctx.destination)
    const chain = () => {
      const bass = ctx.createBiquadFilter(); bass.type = 'lowshelf'; bass.frequency.value = 200
      const mid = ctx.createBiquadFilter(); mid.type = 'peaking'; mid.frequency.value = 1000; mid.Q.value = 1
      const treble = ctx.createBiquadFilter(); treble.type = 'highshelf'; treble.frequency.value = 3000
      const gain = ctx.createGain(); gain.gain.value = 0.8
      const cfGain = ctx.createGain(); cfGain.gain.value = 1
      bass.connect(mid); mid.connect(treble); treble.connect(gain); gain.connect(cfGain); cfGain.connect(masterGain)
      return { bass, mid, treble, gain, cfGain }
    }
    const a = chain(), b = chain()
    N.current = { ctx, analyser, masterGain, aGain: a.gain, aCF: a.cfGain, aBass: a.bass, aMid: a.mid, aTreble: a.treble, bGain: b.gain, bCF: b.cfGain, bBass: b.bass, bMid: b.mid, bTreble: b.treble }
    const [ba, bb, pd] = await Promise.all([genBeat('house'), genBeat('hiphop'), genPads(ctx.sampleRate)])
    aBuf.current = ba; bBuf.current = bb; padBufs.current = pd
    setReady(true); setLoading(false)
  }, [loading])

  const playDeck = useCallback((d: 'A' | 'B') => {
    const n = N.current; if (!n) return
    const buf = d === 'A' ? aBuf.current : bBuf.current; if (!buf) return
    const src = n.ctx.createBufferSource()
    src.buffer = buf; src.loop = true
    src.playbackRate.value = d === 'A' ? aPR.current : bPR.current
    src.connect(d === 'A' ? n.aBass : n.bBass)
    const off = (d === 'A' ? aOff.current : bOff.current) % buf.duration
    src.start(0, off)
    if (d === 'A') { aSrc.current = src; aStart.current = n.ctx.currentTime - off; setAPlay(true); aPlaying.current = true }
    else { bSrc.current = src; bStart.current = n.ctx.currentTime - off; setBPlay(true); bPlaying.current = true }
  }, [])

  const stopDeck = useCallback((d: 'A' | 'B') => {
    const n = N.current; if (!n) return
    if (d === 'A') { aOff.current = (n.ctx.currentTime - aStart.current) % (aBuf.current?.duration ?? 1); aSrc.current?.stop(); aSrc.current = null; setAPlay(false); aPlaying.current = false }
    else { bOff.current = (n.ctx.currentTime - bStart.current) % (bBuf.current?.duration ?? 1); bSrc.current?.stop(); bSrc.current = null; setBPlay(false); bPlaying.current = false }
  }, [])

  const toggle = useCallback((d: 'A' | 'B') => {
    if (d === 'A') aPlaying.current ? stopDeck('A') : playDeck('A')
    else bPlaying.current ? stopDeck('B') : playDeck('B')
  }, [playDeck, stopDeck])

  const loadFile = useCallback(async (d: 'A' | 'B', file: File) => {
    const n = N.current; if (!n) return
    const buf = await n.ctx.decodeAudioData(await file.arrayBuffer())
    const name = file.name.replace(/\.[^.]+$/, '').slice(0, 24)
    if (d === 'A') { const wp = aPlaying.current; if (wp) stopDeck('A'); aBuf.current = buf; aOff.current = 0; setAName(name); if (wp) setTimeout(() => playDeck('A'), 50) }
    else { const wp = bPlaying.current; if (wp) stopDeck('B'); bBuf.current = buf; bOff.current = 0; setBName(name); if (wp) setTimeout(() => playDeck('B'), 50) }
  }, [stopDeck, playDeck])

  const triggerPad = useCallback((name: string) => {
    const n = N.current; const buf = padBufs.current[name]; if (!n || !buf) return
    const src = n.ctx.createBufferSource(); src.buffer = buf; src.connect(n.masterGain); src.start(0)
    setPadActive(name); setTimeout(() => setPadActive(null), 150)
  }, [])

  const pitchChange = useCallback((d: 'A' | 'B', v: number) => {
    if (d === 'A') { setAPitch(v); aPR.current = v; if (aSrc.current) aSrc.current.playbackRate.value = v }
    else { setBPitch(v); bPR.current = v; if (bSrc.current) bSrc.current.playbackRate.value = v }
  }, [])

  const startScratch = useCallback((d: 'A' | 'B', clientX: number) => {
    if (!ready) return
    if (d === 'A') { aScratchRef.current = true; aScratchX.current = clientX; setAScratch(true) }
    else { bScratchRef.current = true; bScratchX.current = clientX; setBScratch(true) }
  }, [ready])

  const moveScratch = useCallback((d: 'A' | 'B', clientX: number) => {
    const scratching = d === 'A' ? aScratchRef.current : bScratchRef.current
    if (!scratching) return
    const lastX = d === 'A' ? aScratchX.current : bScratchX.current
    const delta = clientX - lastX
    if (d === 'A') aScratchX.current = clientX
    else bScratchX.current = clientX
    const src = d === 'A' ? aSrc.current : bSrc.current
    if (src) {
      const next = Math.max(0, Math.min(4, src.playbackRate.value + delta * 0.04))
      src.playbackRate.value = next
    }
  }, [])

  const endScratch = useCallback((d: 'A' | 'B') => {
    const n = N.current
    if (d === 'A') {
      aScratchRef.current = false; setAScratch(false)
      if (aSrc.current && n) aSrc.current.playbackRate.setTargetAtTime(aPR.current, n.ctx.currentTime, 0.08)
    } else {
      bScratchRef.current = false; setBScratch(false)
      if (bSrc.current && n) bSrc.current.playbackRate.setTargetAtTime(bPR.current, n.ctx.currentTime, 0.08)
    }
  }, [])

  useEffect(() => { if (N.current) N.current.aGain.gain.value = aVol }, [aVol])
  useEffect(() => { if (N.current) N.current.bGain.gain.value = bVol }, [bVol])
  useEffect(() => { if (N.current) N.current.masterGain.gain.value = master }, [master])
  useEffect(() => { if (N.current) N.current.aBass.gain.value = aBass }, [aBass])
  useEffect(() => { if (N.current) N.current.aMid.gain.value = aMid }, [aMid])
  useEffect(() => { if (N.current) N.current.aTreble.gain.value = aTreble }, [aTreble])
  useEffect(() => { if (N.current) N.current.bBass.gain.value = bBass }, [bBass])
  useEffect(() => { if (N.current) N.current.bMid.gain.value = bMid }, [bMid])
  useEffect(() => { if (N.current) N.current.bTreble.gain.value = bTreble }, [bTreble])
  useEffect(() => {
    if (!N.current) return
    const a = cf * 0.5 * Math.PI
    N.current.aCF.gain.value = Math.cos(a)
    N.current.bCF.gain.value = Math.cos((1 - cf) * 0.5 * Math.PI)
  }, [cf])

  // Animation loop
  useEffect(() => {
    let id: number
    const loop = () => {
      if (aPlaying.current) aAngle.current += 0.018 * (aSrc.current?.playbackRate.value ?? aPR.current)
      if (bPlaying.current) bAngle.current += 0.018 * (bSrc.current?.playbackRate.value ?? bPR.current)
      if (vA.current) drawVinyl(vA.current, aAngle.current, '#00ff88')
      if (vB.current) drawVinyl(vB.current, bAngle.current, '#00b4ff')
      if (vizRef.current && N.current) {
        const c = vizRef.current.getContext('2d')
        if (c) {
          const data = new Uint8Array(N.current.analyser.frequencyBinCount)
          N.current.analyser.getByteFrequencyData(data)
          const w = vizRef.current.width, h = vizRef.current.height
          c.fillStyle = '#0a0a0a'; c.fillRect(0, 0, w, h)
          const bw = (w / data.length) * 2.5
          data.forEach((v, i) => {
            const bh = (v / 255) * h
            c.fillStyle = `rgb(0,${v},${Math.floor(v * 0.4)})`
            c.fillRect(i * bw, h - bh, bw - 1, bh)
          })
        }
      }
      id = requestAnimationFrame(loop)
    }
    id = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(id)
  }, [])

  const PADS = [
    { id: 'kick',    label: '🥁 KICK',   col: '#ff4444' },
    { id: 'snare',   label: '🎯 SNARE',  col: '#ff8800' },
    { id: 'hihat',   label: '🎩 HIHAT',  col: '#ffcc00' },
    { id: 'clap',    label: '👏 CLAP',   col: '#88ff00' },
    { id: 'openhat', label: '🔔 OPEN',   col: '#00ffcc' },
    { id: 'bass',    label: '🔊 BASS',   col: '#0088ff' },
    { id: 'stab',    label: '⚡ STAB',   col: '#8844ff' },
    { id: 'reverse', label: '🔄 REV',    col: '#ff44cc' },
  ]

  const EQ = ({ label, val, set, node }: { label: string; val: number; set: (v: number) => void; node: BiquadFilterNode | null }) => (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[9px] text-gray-500">{label}</span>
      <input type="range" min={-12} max={12} step={1} value={val} className="w-full"
        onChange={e => { const v = +e.target.value; set(v); if (node) node.gain.value = v }} />
      <span className="text-[9px] text-gray-600">{val > 0 ? '+' : ''}{val}</span>
    </div>
  )

  const DeckPanel = ({ d }: { d: 'A' | 'B' }) => {
    const isA = d === 'A'
    const playing = isA ? aPlay : bPlay
    const vol = isA ? aVol : bVol
    const pitch = isA ? aPitch : bPitch
    const name = isA ? aName : bName
    const color = isA ? '#00ff88' : '#00b4ff'
    const bpmBase = isA ? 128 : 90
    const n = N.current
    return (
      <div className="flex-1 flex flex-col items-center p-3 gap-2 min-w-0 overflow-hidden">
        <div className="text-[10px] font-bold tracking-widest truncate w-full text-center" style={{ color }}>DECK {d}</div>
        <div className="text-[9px] text-gray-500 truncate w-full text-center">{name}</div>
        <canvas ref={isA ? vA : vB} width={150} height={150} className="rounded-full flex-shrink-0"
          style={{ boxShadow: `0 0 24px ${(isA ? aScratch : bScratch) ? color : color + '44'}`, cursor: ready ? (isA ? aScratch : bScratch) ? 'grabbing' : 'grab' : 'default' }}
          onMouseDown={e => { e.preventDefault(); e.stopPropagation(); startScratch(d, e.clientX) }}
          onMouseMove={e => moveScratch(d, e.clientX)}
          onMouseUp={() => endScratch(d)}
          onMouseLeave={() => endScratch(d)}
          onTouchStart={e => { e.stopPropagation(); startScratch(d, e.touches[0].clientX) }}
          onTouchMove={e => { e.preventDefault(); moveScratch(d, e.touches[0].clientX) }}
          onTouchEnd={() => endScratch(d)}
        />
        <div className="text-xs font-mono font-bold" style={{ color }}>
          {(isA ? aScratch : bScratch) ? '✋ SCRATCH' : `♩ ${Math.round(bpmBase * pitch)} BPM`}
        </div>
        <div className="flex gap-2">
          <button onClick={() => { if (!ready) { init().then(() => playDeck(d)); return } toggle(d) }}
            className="px-3 py-1.5 rounded text-xs font-bold transition-all active:scale-95"
            style={{ background: playing ? '#ff444420' : color + '20', border: `1px solid ${playing ? '#ff4444' : color}`, color: playing ? '#ff4444' : color }}>
            {playing ? '⏸ PAUSE' : '▶ PLAY'}
          </button>
          <label className="px-2.5 py-1.5 rounded text-xs cursor-pointer hover:bg-[#1a1a3a] border border-[#2a2a4a] text-gray-400">
            📂
            <input type="file" accept="audio/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (!f) return; if (!ready) init().then(() => loadFile(d, f)); else loadFile(d, f) }} />
          </label>
        </div>
        <div className="w-full">
          <div className="flex justify-between text-[9px] text-gray-500 mb-0.5"><span>VOL</span><span>{Math.round(vol * 100)}%</span></div>
          <input type="range" min={0} max={1} step={0.01} value={vol} className="w-full"
            onChange={e => isA ? setAVol(+e.target.value) : setBVol(+e.target.value)} />
        </div>
        <div className="w-full">
          <div className="flex justify-between text-[9px] text-gray-500 mb-0.5">
            <span>PITCH</span><span>{pitch >= 1 ? '+' : ''}{Math.round((pitch - 1) * 100)}%</span>
          </div>
          <input type="range" min={0.8} max={1.2} step={0.005} value={pitch} className="w-full"
            onChange={e => pitchChange(d, +e.target.value)} />
        </div>
        <div className="w-full grid grid-cols-3 gap-1.5 pt-1 border-t border-[#1a1a2e]">
          {(isA
            ? [['BASS', aBass, setABass, n?.aBass], ['MID', aMid, setAMid, n?.aMid], ['HI', aTreble, setATreble, n?.aTreble]]
            : [['BASS', bBass, setBBass, n?.bBass], ['MID', bMid, setBMid, n?.bMid], ['HI', bTreble, setBTreble, n?.bTreble]]
          ).map(([l, v, s, node]) =>
            <EQ key={l as string} label={l as string} val={v as number} set={s as (v: number) => void} node={(node as BiquadFilterNode) ?? null} />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] text-white select-none overflow-hidden"
      onClick={!ready && !loading ? () => init() : undefined}>
      <div className="flex items-center justify-between px-4 py-2 bg-[#0d0d0d] border-b border-[#1a1a2e] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎧</span>
          <span className="font-bold tracking-[0.25em] text-[#00ff88]">DJMAX</span>
        </div>
        {!ready && (
          <span className="text-[#00ff88] text-xs font-mono animate-pulse">
            {loading ? '⏳ Generating beats…' : '▶ Click anywhere to start'}
          </span>
        )}
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-gray-500">MASTER</span>
          <input type="range" min={0} max={1} step={0.01} value={master} className="w-20"
            onChange={e => setMaster(+e.target.value)} onClick={e => e.stopPropagation()} />
          <span className="text-[9px] text-gray-400 w-6">{Math.round(master * 100)}%</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0">
        <DeckPanel d="A" />
        <div className="w-32 shrink-0 flex flex-col items-center p-3 gap-3 bg-[#0c0c0c] border-x border-[#1a1a2e]">
          <div className="text-[9px] font-bold tracking-widest text-[#00b4ff]">MIXER</div>
          <div className="w-full">
            <div className="flex justify-between text-[9px] mb-0.5"><span style={{ color: '#00ff88' }}>A</span><span style={{ color: '#00b4ff' }}>B</span></div>
            <input type="range" min={0} max={1} step={0.01} value={cf} className="w-full"
              onChange={e => setCf(+e.target.value)} onClick={e => e.stopPropagation()} />
            <div className="text-[9px] text-gray-600 text-center mt-0.5">CROSSFADER</div>
          </div>
          {[{ label: 'BPM A', val: Math.round(128 * aPitch), color: '#00ff88' }, { label: 'BPM B', val: Math.round(90 * bPitch), color: '#00b4ff' }].map(({ label, val, color }) => (
            <div key={label} className="w-full bg-[#0a0a1a] rounded p-2 text-center border border-[#1a1a2e]">
              <div className="font-mono font-bold text-base" style={{ color }}>{val}</div>
              <div className="text-[8px] text-gray-600">{label}</div>
            </div>
          ))}
        </div>
        <DeckPanel d="B" />
      </div>

      <div className="shrink-0 border-t border-[#1a1a2e]">
        <canvas ref={vizRef} width={1200} height={52} className="w-full" style={{ height: 52, display: 'block' }} />
      </div>

      <div className="shrink-0 flex gap-1.5 justify-center px-3 py-2 bg-[#0d0d0d] border-t border-[#1a1a2e] flex-wrap">
        {PADS.map(({ id, label, col }) => (
          <button key={id}
            onMouseDown={e => { e.stopPropagation(); if (!ready) { init(); return } triggerPad(id) }}
            onTouchStart={e => { e.stopPropagation(); if (!ready) { init(); return } triggerPad(id) }}
            className={`px-3 py-2 rounded text-xs font-bold active:scale-90 transition-all ${padActive === id ? 'pad-active' : ''}`}
            style={{ background: padActive === id ? col : col + '18', border: `1px solid ${col}55`, color: padActive === id ? '#000' : col }}>
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
