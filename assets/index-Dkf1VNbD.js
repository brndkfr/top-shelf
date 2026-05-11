(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function n(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(e){if(e.ep)return;e.ep=!0;const o=n(e);fetch(e.href,o)}})();const w="http://www.w3.org/2000/svg",ot={left:{x:163.75,y:350},right:{x:1036.25,y:350}},rt={left:[{x:171.25,y:330},{x:171.25,y:370}],right:[{x:1028.75,y:330},{x:1028.75,y:370}]},at={left:{x:171.25,y:350},right:{x:1028.75,y:350}},R=65,lt=50,dt=20,ct=100,j=[{id:"player-g",label:"G",x:90,y:250,symbol:"sym-player-goalie"},{id:"player-ld",label:"LD",x:280,y:155},{id:"player-rd",label:"RD",x:280,y:345},{id:"player-c",label:"C",x:490,y:250},{id:"player-lw",label:"LW",x:650,y:105},{id:"player-rw",label:"RW",x:650,y:395}],K=[{id:"opponent-g",label:"G",x:920,y:250,symbol:"sym-opponent-goalie"},{id:"opponent-ld",label:"LD",x:730,y:155},{id:"opponent-rd",label:"RD",x:730,y:345},{id:"opponent-c",label:"C",x:510,y:290},{id:"opponent-lw",label:"LW",x:420,y:105},{id:"opponent-rw",label:"RW",x:420,y:395}],ht=[{x:810,y:185,rotate:0,labels:{en:"Pocket",de:"Tasche"}},{x:810,y:515,rotate:0,labels:{en:"Pocket",de:"Tasche"}},{x:790,y:350,rotate:0,labels:{en:"High Slot",de:"Hoher Slot"}},{x:955,y:350,rotate:0,labels:{en:"Low Slot",de:"Naher Slot"}},{x:1064,y:250,rotate:-90,labels:{en:"Playmaker",de:"Playmaker"}},{x:1064,y:450,rotate:-90,labels:{en:"Playmaker",de:"Playmaker"}}],gt=[{x:390,y:185,rotate:0,labels:{en:"Pocket",de:"Tasche"}},{x:390,y:515,rotate:0,labels:{en:"Pocket",de:"Tasche"}},{x:410,y:350,rotate:0,labels:{en:"High Slot",de:"Hoher Slot"}},{x:245,y:350,rotate:0,labels:{en:"Low Slot",de:"Naher Slot"}},{x:136,y:250,rotate:90,labels:{en:"Playmaker",de:"Playmaker"}},{x:136,y:450,rotate:90,labels:{en:"Playmaker",de:"Playmaker"}}],Y="M 50 10 C 27.9 10 10 27.9 10 50 C 10 72.1 27.9 90 50 90 C 66.8 90 81.3 79.8 87.6 65 L 100 50 L 87.6 35 C 81.3 20.2 66.8 10 50 10 Z",V="M 45 15 C 15 15 10 30 10 50 C 10 70 15 85 45 85 C 65 85 75 75 75 50 C 75 25 65 15 45 15 Z",ut=`
  <path d="M 65 25 C 95 30 95 70 65 75" stroke-width="3" stroke-linecap="round" fill="none"/>
  <line x1="68" y1="38" x2="88" y2="42" stroke-width="2"/>
  <line x1="70" y1="50" x2="92" y2="50" stroke-width="2"/>
  <line x1="68" y1="62" x2="88" y2="58" stroke-width="2"/>
  <path d="M 75 28 Q 85 50 75 72" stroke-width="2" fill="none"/>`;function pt(i,t,n,s,e,o=700){const a=parseFloat(i.dataset.x),l=parseFloat(i.dataset.y),c=parseFloat(i.dataset.angle??"0"),u=((s-c)%360+540)%360-180,h=performance.now();let p=null;function y(z){const H=Math.min((z-h)/o,1),G=1-Math.pow(1-H,3);i.dataset.x=a+(t-a)*G,i.dataset.y=l+(n-l)*G,i.dataset.angle=c+u*G,e(i),H<1&&(p=requestAnimationFrame(y))}return p=requestAnimationFrame(y),()=>{p!==null&&cancelAnimationFrame(p)}}const F={id:"player-g",label:"G",symbol:"sym-player-goalie",x:175,y:350},q={id:"opponent-g",label:"G",symbol:"sym-opponent-goalie",x:1025,y:350},ft={neutral:{layers:{rink:!0},players:j,opponents:K},"defensiv-212":{layers:{rink:!0,"zone-slot":!0},players:[F,{id:"player-ld",label:"V1",x:295,y:215},{id:"player-rd",label:"V2",x:260,y:485},{id:"player-c",label:"C",x:400,y:350},{id:"player-lw",label:"S1",x:545,y:215},{id:"player-rw",label:"S2",x:510,y:485}],opponents:[q,{id:"opponent-ld",label:"V1",x:860,y:170},{id:"opponent-rd",label:"V2",x:860,y:530},{id:"opponent-c",label:"C",x:715,y:350},{id:"opponent-lw",label:"A1",x:645,y:155},{id:"opponent-rw",label:"A2",x:645,y:545}]},forechecking:{layers:{rink:!0},players:[F,{id:"player-ld",label:"V1",x:450,y:220},{id:"player-rd",label:"V2",x:450,y:480},{id:"player-c",label:"C",x:650,y:350},{id:"player-lw",label:"S1",x:875,y:255},{id:"player-rw",label:"S2",x:800,y:470}],opponents:[q,{id:"opponent-ld",label:"V1",x:900,y:165},{id:"opponent-rd",label:"V2",x:900,y:535},{id:"opponent-c",label:"C",x:750,y:350},{id:"opponent-lw",label:"A1",x:750,y:165},{id:"opponent-rw",label:"A2",x:750,y:535}]},"triangle-attack":{layers:{rink:!0,"zone-slot-right":!0},players:[F,{id:"player-ld",label:"V1",x:430,y:220},{id:"player-rd",label:"V2",x:430,y:480},{id:"player-c",label:"C",x:720,y:350},{id:"player-lw",label:"S1",x:855,y:170},{id:"player-rw",label:"S2",x:855,y:530}],opponents:[q,{id:"opponent-ld",label:"V1",x:920,y:215},{id:"opponent-rd",label:"V2",x:920,y:485},{id:"opponent-c",label:"C",x:800,y:350},{id:"opponent-lw",label:"A1",x:700,y:215},{id:"opponent-rw",label:"A2",x:700,y:485}]},"corner-play":{layers:{rink:!0,"zone-slot-right":!0},players:[F,{id:"player-ld",label:"V1",x:570,y:310},{id:"player-rd",label:"V2",x:570,y:395},{id:"player-c",label:"C",x:900,y:350},{id:"player-lw",label:"S1",x:1060,y:155},{id:"player-rw",label:"S2",x:985,y:425}],opponents:[q,{id:"opponent-ld",label:"V1",x:920,y:215},{id:"opponent-rd",label:"V2",x:920,y:485},{id:"opponent-c",label:"C",x:800,y:350},{id:"opponent-lw",label:"A1",x:700,y:215},{id:"opponent-rw",label:"A2",x:700,y:485}]}},yt=`<svg viewBox="0 0 1200 700" xmlns="http://www.w3.org/2000/svg">
  <!-- Dark background for optimal contrast -->
  <rect id="background" width="1200" height="700" fill="#1e1e24" />

  <!-- ========================================== -->
  <!-- OUTER AREAS (Benches & Officials' Table)   -->
  <!-- ========================================== -->
  <g id="outer-area" font-family="Arial, sans-serif" font-size="14" fill="#a0a0a0" text-anchor="middle">

    <!-- Top: Player benches (10m long, starting 5m from center line) -->
    <!-- Left bench (Home) -->
    <rect id="bench-home" x="225" y="40" width="250" height="40" fill="none" stroke="#a0a0a0" stroke-dasharray="4,4" stroke-width="2" />
    <rect id="bench-home-seat" x="235" y="50" width="230" height="20" fill="#444" />
    <text x="350" y="30">Spielerbank</text>

    <!-- Right bench (Away) -->
    <rect id="bench-away" x="725" y="40" width="250" height="40" fill="none" stroke="#a0a0a0" stroke-dasharray="4,4" stroke-width="2" />
    <rect id="bench-away-seat" x="735" y="50" width="230" height="20" fill="#444" />
    <text x="850" y="30">Spielerbank</text>

    <!-- Bottom: Officials' table and penalty benches -->
    <!-- Left penalty bench (2m long, starting 1m from center) -->
    <rect id="penalty-bench-left" x="525" y="620" width="50" height="40" fill="none" stroke="#a0a0a0" stroke-dasharray="4,4" stroke-width="2" />
    <rect id="penalty-bench-left-seat" x="530" y="630" width="40" height="20" fill="#444" />
    <text x="550" y="680">Strafbank</text>

    <!-- Officials' table (centered on center line) -->
    <rect id="timekeeper-table" x="575" y="620" width="50" height="40" fill="none" stroke="#a0a0a0" stroke-dasharray="4,4" stroke-width="2" />
    <rect id="timekeeper-seat" x="580" y="630" width="40" height="20" fill="#444" />
    <text x="600" y="680">Sekretariat</text>

    <!-- Right penalty bench (2m long, starting 1m from center) -->
    <rect id="penalty-bench-right" x="625" y="620" width="50" height="40" fill="none" stroke="#a0a0a0" stroke-dasharray="4,4" stroke-width="2" />
    <rect id="penalty-bench-right-seat" x="630" y="630" width="40" height="20" fill="#444" />
    <text x="650" y="680">Strafbank</text>
  </g>


  <!-- ========================================== -->
  <!-- THE PLAYING FIELD (offset to center)       -->
  <!-- ========================================== -->
  <!-- translate(100,100) gives the field 100px margin on all sides -->
  <g id="field" transform="translate(100, 100)">

    <!-- Blue field surface (40m × 20m → 1000×500px, 2m corner radius → rx="50") -->
    <rect id="field-surface" width="1000" height="500" rx="50" ry="50" fill="#2c5a94" />

    <!-- White boards (outline) -->
    <rect id="field-border" x="0" y="0" width="1000" height="500" rx="50" ry="50" fill="none" stroke="#ffffff" stroke-width="4" />

    <!-- Centre Line and Centre Spot (face-off) -->
    <line id="center-line" x1="500" y1="0" x2="500" y2="500" stroke="#ffffff" stroke-width="2" />
    <circle id="center-dot" cx="500" cy="250" r="4" fill="#ffffff" />

    <!-- Substitution zone markings on the upper boards -->
    <line id="sub-mark-1" x1="125" y1="0" x2="125" y2="15" stroke="#ffffff" stroke-width="3" />
    <line id="sub-mark-2" x1="375" y1="0" x2="375" y2="15" stroke="#ffffff" stroke-width="3" />
    <line id="sub-mark-3" x1="625" y1="0" x2="625" y2="15" stroke="#ffffff" stroke-width="3" />
    <line id="sub-mark-4" x1="875" y1="0" x2="875" y2="15" stroke="#ffffff" stroke-width="3" />

    <!-- Face-off marks (1.5m from boards) -->
    <g id="faceoff-marks" stroke="#ffffff" stroke-width="2" fill="none">
      <!-- On the center line -->
      <path d="M 500 32.5 v 10 m -5 -5 h 10" />
      <path d="M 500 467.5 v -10 m -5 5 h 10" />
      <!-- Left goal line -->
      <path d="M 71.25 32.5 v 10 m -5 -5 h 10" />
      <path d="M 71.25 467.5 v -10 m -5 5 h 10" />
      <!-- Right goal line -->
      <path d="M 928.75 32.5 v 10 m -5 -5 h 10" />
      <path d="M 928.75 467.5 v -10 m -5 5 h 10" />
    </g>

    <!-- LEFT HALF -->
    <g id="left-half">
      <!-- Goal line (2.85m from the boards) -->
      <line id="goal-line-left" x1="71.25" y1="0" x2="71.25" y2="500" stroke="#ffffff" stroke-width="2" />

      <!-- Large goal crease (4×5m) -->
      <rect id="crease-left" x="55" y="187.5" width="100" height="125" fill="none" stroke="#ffffff" stroke-width="2" />

      <!-- Goalkeeper Area (1×2.5m) -->
      <rect id="goalkeeper-area-left" x="71.25" y="218.75" width="25" height="62.5" fill="#2c5a94" stroke="#ffffff" stroke-width="2" />

      <!-- Goal (cage extends behind the goal line) -->
      <rect id="goal-left" x="56.25" y="230" width="15" height="40" fill="none" stroke="#d32f2f" stroke-width="4" />
    </g>

    <!-- RIGHT HALF -->
    <g id="right-half">
      <!-- Goal line -->
      <line id="goal-line-right" x1="928.75" y1="0" x2="928.75" y2="500" stroke="#ffffff" stroke-width="2" />

      <!-- Large goal crease -->
      <rect id="crease-right" x="845" y="187.5" width="100" height="125" fill="none" stroke="#ffffff" stroke-width="2" />

      <!-- Goalkeeper Area -->
      <rect id="goalkeeper-area-right" x="903.75" y="218.75" width="25" height="62.5" fill="#2c5a94" stroke="#ffffff" stroke-width="2" />

      <!-- Goal -->
      <rect id="goal-right" x="928.75" y="230" width="15" height="40" fill="none" stroke="#d32f2f" stroke-width="4" />
    </g>

  </g>
</svg>
`,X=`<svg viewBox="0 0 1200 700" xmlns="http://www.w3.org/2000/svg">
  <!-- Styles für die Interaktion und Farben der Zonen -->
  <style>
    .zone { 
      transition: fill-opacity 0.3s;
      cursor: pointer;
    }
    .zone:hover { fill-opacity: 0.8 !important; }
    
    /* Farben analog zu deinem ursprünglichen Bild */
    .color-tasche { fill: #f8c8c8; fill-opacity: 0.6; }
    .color-high-slot { fill: #db6e6e; fill-opacity: 0.7; }
    .color-low-slot { fill: #8b1a2a; fill-opacity: 0.85; }
    .color-playmaker { fill: #a53939; fill-opacity: 0.7; }
  </style>

  <!-- Transform verschiebt die Zonen exakt deckungsgleich über das Spielfeld -->
  <g transform="translate(100, 100)">
    
    <!-- Pocket Top -->
    <rect id="pocket-top" class="zone color-tasche" x="600" y="25" width="220" height="120" />

    <!-- Pocket Bottom -->
    <rect id="pocket-bottom" class="zone color-tasche" x="600" y="355" width="220" height="120" />

    <!-- High Slot -->
    <rect id="high-slot" class="zone color-high-slot" x="600" y="160" width="180" height="180" />

    <!-- Low Slot (tip reaches exactly to the goal crease/goal line) -->
    <!-- X: 780 (end of high slot) to 928.75 (goal line) -->
    <polygon id="low-slot" class="zone color-low-slot" points="780,160 928.75,215 928.75,285 780,340" />

    <!-- Playmaker Top (behind the goal to the right board) -->
    <rect id="playmaker-top" class="zone color-playmaker" x="928.75" y="100" width="71.25" height="100" />

    <!-- Playmaker Bottom (behind the goal to the right board) -->
    <rect id="playmaker-bottom" class="zone color-playmaker" x="928.75" y="300" width="71.25" height="100" />

  </g>
</svg>
`;let bt=0;function O(i){return"data:image/svg+xml,"+encodeURIComponent(i)}class Z{constructor(t,n={}){this._uid=`fb${++bt}`,this._mount=t,this._opts={lang:"en",tokenSize:lt,layers:{rink:!0,zones:!0},home:{color:"#003DA5",accent:"#FFCD00"},away:{color:"#8b1a2a",accent:"#ffffff"},players:j,opponents:K,...n,home:{color:"#003DA5",accent:"#FFCD00",...n.home},away:{color:"#8b1a2a",accent:"#ffffff",...n.away}},this._tokenSize=this._opts.tokenSize,this._lang=this._opts.lang,this._shootingActive=!1,this._shootingTarget="right",this._dragging=null,this._dragMoved=!1,this._dragOffset={x:0,y:0},this._cancelGoalieAnim=null,this._handlers={},this._buildSvg(),this._renderAllTokens(),this._renderZoneLabels(),this._opts.layers.zones||this._q("zone-labels").setAttribute("display","none"),this._bindEvents()}_id(t){return`${this._uid}-${t}`}_q(t){return this._svg.querySelector(`#${this._id(t)}`)}_buildSvg(){const{home:t,away:n,layers:s}=this._opts,e=this._uid,o=c=>`<g pointer-events="none" stroke="${c}">${ut}</g>`,a=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700"
     style="width:100%;height:auto;display:block">
  <defs>
    <style>
      .${e}-token { cursor: grab; user-select: none; }
      .${e}-token:hover { filter: brightness(1.25); }
      .${e}-token.dragging { cursor: grabbing; }
    </style>
    <symbol id="${e}-sym-player" viewBox="0 0 100 100">
      <path d="${Y}" fill="${t.color}" stroke="${t.accent}" stroke-width="2"/>
    </symbol>
    <symbol id="${e}-sym-opponent" viewBox="0 0 100 100">
      <path d="${Y}" fill="${n.color}" stroke="${n.accent}" stroke-width="2"/>
    </symbol>
    <symbol id="${e}-sym-player-goalie" viewBox="0 0 100 100">
      <path d="${V}" fill="${t.color}" stroke="${t.accent}" stroke-width="2"/>
      ${o(t.accent)}
    </symbol>
    <symbol id="${e}-sym-opponent-goalie" viewBox="0 0 100 100">
      <path d="${V}" fill="${n.color}" stroke="${n.accent}" stroke-width="2"/>
      ${o(n.accent)}
    </symbol>
    <symbol id="${e}-sym-ball" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="11" fill="#39ff14" stroke="#1a7a00" stroke-width="1.5"/>
      <circle cx="8" cy="8" r="4" fill="rgba(255,255,255,0.35)"/>
    </symbol>
    <marker id="${e}-arrow-head" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="rgba(255,255,255,0.85)"/>
    </marker>
  </defs>

  <image id="${e}-rink-image"  href="${O(yt)}"
         x="0" y="0" width="1200" height="700"
         style="transition:opacity 0.25s ease"
         opacity="${s.rink?1:0}"/>
  <image id="${e}-zones-image" href="${O(X)}"
         x="0" y="0" width="1200" height="700"
         style="transition:opacity 0.25s ease"
         opacity="${s.zones?1:0}"/>
  <image id="${e}-zones-left-image" href="${O(X)}"
         x="0" y="0" width="1200" height="700"
         transform="translate(1200,0) scale(-1,1)"
         style="transition:opacity 0.25s ease"
         opacity="${s.zonesLeft?1:0}"/>

  <g id="${e}-goalie-zones" pointer-events="none">
    <g id="${e}-zone-attention" display="none">
      <path id="${e}-zone-attention-fill"
            d="M 475,100 L 850,100 L 850,600 L 475,600 Z"
            fill="rgba(255,210,60,0.22)" stroke="rgba(255,210,60,0.65)" stroke-width="1.5"/>
      <text id="${e}-zone-attention-label" x="663" y="132" text-anchor="middle"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="16" font-weight="600" letter-spacing="0.5"
            fill="rgba(255,210,60,0.9)">Attention Zone</text>
    </g>
    <g id="${e}-zone-awareness" display="none">
      <path id="${e}-zone-awareness-fill"
            d="M 767,100 L 1050,100 A 50,50 0 0,1 1100,150 L 1100,550 A 50,50 0 0,1 1050,600 L 767,600 Z"
            fill="rgba(80,240,80,0.26)" stroke="rgba(80,240,80,0.75)" stroke-width="1.5"/>
      <text id="${e}-zone-awareness-label" x="934" y="132" text-anchor="middle"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="16" font-weight="600" letter-spacing="0.5"
            fill="rgba(120,200,100,0.9)">Awareness Zone</text>
    </g>
    <g id="${e}-zone-passing-first" display="none">
      <path id="${e}-zone-passing-first-fill"
            d="M 150,100 L 299,100 L 210,130 L 175,175 L 172,250 L 172,450 L 175,525 L 210,570 L 299,600 L 150,600 L 114,586 L 100,550 L 100,150 L 114,114 Z"
            fill="rgba(255,165,100,0.25)" stroke="rgba(255,165,100,0.65)" stroke-width="1.5"/>
      <text id="${e}-zone-passing-first-label" x="136" y="350" text-anchor="middle"
            dominant-baseline="central"
            transform="rotate(-90,136,350)"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="16" font-weight="600" letter-spacing="0.5"
            fill="rgba(255,185,120,0.9)">Passing-First-Zone</text>
    </g>
    <g id="${e}-zone-danger" display="none">
      <rect id="${e}-zone-danger-fill"
            x="155" y="100" width="400" height="500" rx="50"
            fill="rgba(255,100,100,0.18)" stroke="rgba(255,100,100,0.6)" stroke-width="1.5"/>
      <text id="${e}-zone-danger-label" x="355" y="140" text-anchor="middle"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="16" font-weight="600" letter-spacing="0.5"
            fill="rgba(255,130,130,0.9)">Danger Zone</text>
    </g>
    <g id="${e}-zone-slot" display="none">
      <path id="${e}-zone-slot-fill"
            d="M 171,288 L 421,250 L 421,450 L 171,412 Z"
            fill="rgba(255,80,80,0.28)" stroke="rgba(255,80,80,0.7)" stroke-width="1.5"/>
      <text id="${e}-zone-slot-label" x="350" y="350" text-anchor="middle"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="16" font-weight="600" letter-spacing="0.5"
            dominant-baseline="central"
            fill="rgba(255,130,130,0.9)">Slot</text>
    </g>

    <!-- ── Mirrored zones for the right goal end (x' = 1200 − x) ── -->
    <g id="${e}-zone-attention-right" display="none">
      <path id="${e}-zone-attention-right-fill"
            d="M 725,100 L 350,100 L 350,600 L 725,600 Z"
            fill="rgba(255,210,60,0.22)" stroke="rgba(255,210,60,0.65)" stroke-width="1.5"/>
      <text id="${e}-zone-attention-right-label" x="537" y="132" text-anchor="middle"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="16" font-weight="600" letter-spacing="0.5"
            fill="rgba(255,210,60,0.9)">Attention Zone</text>
    </g>
    <g id="${e}-zone-awareness-left" display="none">
      <path id="${e}-zone-awareness-left-fill"
            d="M 433,100 L 150,100 A 50,50 0 0,0 100,150 L 100,550 A 50,50 0 0,0 150,600 L 433,600 Z"
            fill="rgba(80,240,80,0.26)" stroke="rgba(80,240,80,0.75)" stroke-width="1.5"/>
      <text id="${e}-zone-awareness-left-label" x="266" y="132" text-anchor="middle"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="16" font-weight="600" letter-spacing="0.5"
            fill="rgba(120,200,100,0.9)">Awareness Zone</text>
    </g>
    <g id="${e}-zone-passing-first-right" display="none">
      <path id="${e}-zone-passing-first-right-fill"
            d="M 1050,100 L 901,100 L 990,130 L 1025,175 L 1028,250 L 1028,450 L 1025,525 L 990,570 L 901,600 L 1050,600 L 1086,586 L 1100,550 L 1100,150 L 1086,114 Z"
            fill="rgba(255,165,100,0.25)" stroke="rgba(255,165,100,0.65)" stroke-width="1.5"/>
      <text id="${e}-zone-passing-first-right-label" x="1064" y="350" text-anchor="middle"
            dominant-baseline="central"
            transform="rotate(90,1064,350)"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="16" font-weight="600" letter-spacing="0.5"
            fill="rgba(255,185,120,0.9)">Passing-First-Zone</text>
    </g>
    <g id="${e}-zone-danger-right" display="none">
      <rect id="${e}-zone-danger-right-fill"
            x="645" y="100" width="400" height="500" rx="50"
            fill="rgba(255,100,100,0.18)" stroke="rgba(255,100,100,0.6)" stroke-width="1.5"/>
      <text id="${e}-zone-danger-right-label" x="845" y="140" text-anchor="middle"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="16" font-weight="600" letter-spacing="0.5"
            fill="rgba(255,130,130,0.9)">Danger Zone</text>
    </g>
    <g id="${e}-zone-slot-right" display="none">
      <path id="${e}-zone-slot-right-fill"
            d="M 1029,288 L 779,250 L 779,450 L 1029,412 Z"
            fill="rgba(255,80,80,0.28)" stroke="rgba(255,80,80,0.7)" stroke-width="1.5"/>
      <text id="${e}-zone-slot-right-label" x="850" y="350" text-anchor="middle"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="16" font-weight="600" letter-spacing="0.5"
            dominant-baseline="central"
            fill="rgba(255,130,130,0.9)">Slot</text>
    </g>
  </g>

  <g id="${e}-zone-labels"></g>
  <g id="${e}-zone-labels-left"></g>

  <polygon id="${e}-shooting-triangle"
           points="600,350 1028.75,330 1028.75,370"
           fill="rgba(232,200,64,0.22)" stroke="rgba(232,200,64,0.5)"
           stroke-width="1" display="none"/>
  <line id="${e}-shooting-line"
        x1="600" y1="350" x2="1036.25" y2="350"
        stroke="rgba(255,255,255,0.75)" stroke-width="2" stroke-dasharray="10,5"
        marker-end="url(#${e}-arrow-head)" display="none"/>

  <g id="${e}-tokens"></g>
</svg>`,l=document.createElement("div");l.innerHTML=a.trim(),this._svg=l.firstElementChild,this._mount.appendChild(this._svg)}_updateTransform(t){const n=parseFloat(t.dataset.x),s=parseFloat(t.dataset.y),e=parseFloat(t.dataset.angle??"0");t.setAttribute("transform",`translate(${n},${s}) rotate(${e})`);const o=t.querySelector("text");o&&o.setAttribute("transform",`rotate(${-e})`)}_renderToken(t,n){const{home:s,away:e}=this._opts,o=this._uid,a=this._tokenSize/2,c=n==="player"?s.accent:e.accent,u=t.symbol??`sym-${n}`,h=document.createElementNS(w,"g");h.setAttribute("id",`${o}-${t.id}`),h.setAttribute("class",`${o}-token`),h.dataset.type=n,h.dataset.x=t.x,h.dataset.y=t.y,h.dataset.angle="0",h.dataset.initX=t.x,h.dataset.initY=t.y,this._updateTransform(h);const p=document.createElementNS(w,"use");if(p.setAttribute("href",`#${o}-${u}`),p.setAttribute("x",-a),p.setAttribute("y",-a),p.setAttribute("width",this._tokenSize),p.setAttribute("height",this._tokenSize),h.appendChild(p),t.label){const y=document.createElementNS(w,"text");y.setAttribute("x","0"),y.setAttribute("y","0"),y.setAttribute("text-anchor","middle"),y.setAttribute("dominant-baseline","central"),y.setAttribute("font-family","system-ui, -apple-system, sans-serif"),y.setAttribute("letter-spacing","0.5"),y.setAttribute("font-size",Math.round(this._tokenSize*.28)),y.setAttribute("font-weight","bold"),y.setAttribute("fill",c),y.setAttribute("pointer-events","none"),y.textContent=t.label,h.appendChild(y)}return h}_renderBall(t){const n=this._uid,s=document.createElementNS(w,"g");s.setAttribute("id",`${n}-ball`),s.setAttribute("class",`${n}-token`),s.dataset.x="600",s.dataset.y="350",s.dataset.type="ball",s.setAttribute("transform","translate(600,350)");const e=document.createElementNS(w,"use");return e.setAttribute("href",`#${n}-sym-ball`),e.setAttribute("x","-12"),e.setAttribute("y","-12"),e.setAttribute("width","24"),e.setAttribute("height","24"),s.appendChild(e),t.appendChild(s),s}_renderAllTokens(){const t=this._q("tokens"),{players:n,opponents:s}=this._opts;n.forEach(e=>t.appendChild(this._renderToken(e,"player"))),s.forEach(e=>t.appendChild(this._renderToken(e,"opponent"))),this._renderBall(t)}_resetTokenGroup(t,n){const s=this._q("tokens"),e=this._q("ball"),o={};s.querySelectorAll(`[data-type="${t}"]`).forEach(a=>{o[a.id]={x:a.dataset.x,y:a.dataset.y,angle:a.dataset.angle},a.remove()}),n.forEach(a=>{const l=this._renderToken(a,t);s.insertBefore(l,e);const c=o[`${this._uid}-${a.id}`];c&&(l.dataset.x=c.x,l.dataset.y=c.y,l.dataset.angle=c.angle,this._updateTransform(l))})}_renderZoneLabels(){this._fillZoneLabels(this._q("zone-labels"),ht),this._fillZoneLabels(this._q("zone-labels-left"),gt)}_fillZoneLabels(t,n){t.innerHTML="",n.forEach(s=>{const e=document.createElementNS(w,"text");e.setAttribute("x",s.x),e.setAttribute("y",s.y),e.setAttribute("text-anchor","middle"),e.setAttribute("dominant-baseline","central"),e.setAttribute("font-family","system-ui, -apple-system, sans-serif"),e.setAttribute("font-size","13"),e.setAttribute("font-weight","600"),e.setAttribute("fill","rgba(255,255,255,0.75)"),e.setAttribute("pointer-events","none"),e.setAttribute("letter-spacing","0.5"),s.rotate&&e.setAttribute("transform",`rotate(${s.rotate},${s.x},${s.y})`),e.textContent=s.labels[this._lang]??s.labels.en,t.appendChild(e)})}_updateShootingLine(){const t=this._q("ball"),n=parseFloat(t.dataset.x),s=parseFloat(t.dataset.y),e=ot[this._shootingTarget],o=rt[this._shootingTarget];this._q("shooting-line").setAttribute("x1",n),this._q("shooting-line").setAttribute("y1",s),this._q("shooting-line").setAttribute("x2",e.x),this._q("shooting-line").setAttribute("y2",e.y),this._q("shooting-triangle").setAttribute("points",`${n},${s} ${o[0].x},${o[0].y} ${o[1].x},${o[1].y}`);const a=this._shootingTarget==="right"?"opponent-g":"player-g",l=this._q(a),c=Math.atan2(s-parseFloat(l.dataset.y),n-parseFloat(l.dataset.x))*180/Math.PI;l.dataset.angle=c,this._updateTransform(l)}_calcIdealGoaliePos(t,n){const s=at[this._shootingTarget],e=t-s.x,o=n-s.y,a=Math.sqrt(e*e+o*o)||1;return{x:s.x+e/a*R,y:s.y+o/a*R,angle:Math.atan2(o,e)*180/Math.PI}}_toSvgPoint(t,n){const s=this._svg.createSVGPoint();s.x=t,s.y=n;const e=this._svg.getScreenCTM();return e?s.matrixTransform(e.inverse()):s}_startDrag(t,n,s){this._dragging=t,this._dragMoved=!1,t.classList.add("dragging"),t.parentNode.appendChild(t);const e=this._toSvgPoint(n,s);this._dragOffset.x=e.x-parseFloat(t.dataset.x),this._dragOffset.y=e.y-parseFloat(t.dataset.y)}_handleMove(t,n){if(!this._dragging)return;this._dragMoved=!0;const s=this._toSvgPoint(t,n);this._dragging.dataset.x=Math.min(1200,Math.max(0,s.x-this._dragOffset.x)),this._dragging.dataset.y=Math.min(700,Math.max(0,s.y-this._dragOffset.y)),this._updateTransform(this._dragging),this._dragging.id===this._id("ball")&&this._shootingActive&&this._updateShootingLine()}_handleUp(){if(!this._dragging)return;const t=this._dragging;if(this._dragMoved)this._emit("tokenMoved",{id:t.id,x:parseFloat(t.dataset.x),y:parseFloat(t.dataset.y),angle:parseFloat(t.dataset.angle??"0")});else if(t.dataset.type!=="ball"){const n=(parseFloat(t.dataset.angle??"0")+45)%360;t.dataset.angle=n,this._updateTransform(t),this._emit("tokenRotated",{id:t.id,angle:n})}else this._shootingActive&&(this._shootingTarget=this._shootingTarget==="right"?"left":"right",this._updateShootingLine(),this._emit("goalSwitched",{target:this._shootingTarget}));t.classList.remove("dragging"),this._dragging=null}_bindEvents(){this._onMouseMove=t=>this._handleMove(t.clientX,t.clientY),this._onMouseUp=()=>this._handleUp(),this._onTouchMove=t=>{t.preventDefault(),this._handleMove(t.touches[0].clientX,t.touches[0].clientY)},this._onTouchEnd=()=>this._handleUp(),this._svg.addEventListener("mousemove",this._onMouseMove),window.addEventListener("mouseup",this._onMouseUp),this._svg.addEventListener("touchmove",this._onTouchMove,{passive:!1}),window.addEventListener("touchend",this._onTouchEnd),this._svg.addEventListener("mousedown",t=>{const n=t.target.closest(`.${this._uid}-token`);n&&(t.preventDefault(),this._startDrag(n,t.clientX,t.clientY))}),this._svg.addEventListener("touchstart",t=>{const n=t.target.closest(`.${this._uid}-token`);n&&(t.preventDefault(),this._startDrag(n,t.touches[0].clientX,t.touches[0].clientY))},{passive:!1})}_emit(t,n){const s=this._handlers[t];s&&s.forEach(e=>e(n))}on(t,n){var s;return((s=this._handlers)[t]??(s[t]=[])).push(n),this}off(t,n){return this._handlers[t]&&(this._handlers[t]=this._handlers[t].filter(s=>s!==n)),this}setLayer(t,n){if(t==="zone-awareness"||t==="zone-attention"||t==="zone-danger"||t==="zone-slot"||t==="zone-passing-first"||t==="zone-awareness-left"||t==="zone-attention-right"||t==="zone-danger-right"||t==="zone-slot-right"||t==="zone-passing-first-right")return this._q(t).setAttribute("display",n?"":"none"),this;const s=this._q(`${t}-image`);return s&&s.setAttribute("opacity",n?1:0),t==="zones"&&this._q("zone-labels").setAttribute("display",n?"":"none"),t==="zones-left"&&this._q("zone-labels-left").setAttribute("display",n?"":"none"),this}setLang(t){return this._lang=t,this._renderZoneLabels(),this}setTokenSize(t){this._tokenSize=Math.min(ct,Math.max(dt,t));const n=this._tokenSize/2,s=Math.round(this._tokenSize*.28);return this._svg.querySelectorAll(`.${this._uid}-token`).forEach(e=>{if(e.dataset.type==="ball")return;const o=e.querySelector("use");o.setAttribute("x",-n),o.setAttribute("y",-n),o.setAttribute("width",this._tokenSize),o.setAttribute("height",this._tokenSize);const a=e.querySelector("text");a&&a.setAttribute("font-size",s)}),this}setShootingLine(t){this._shootingActive=t;const n=t?"":"none";return this._q("shooting-line").setAttribute("display",n),this._q("shooting-triangle").setAttribute("display",n),t&&this._updateShootingLine(),this}moveGoalieToIdealPosition(t=700){if(!this._shootingActive)return this;const n=this._q("ball"),s=parseFloat(n.dataset.x),e=parseFloat(n.dataset.y),o=this._shootingTarget==="right"?"opponent-g":"player-g",a=this._q(o),l=this._calcIdealGoaliePos(s,e);return this._cancelGoalieAnim&&this._cancelGoalieAnim(),this._cancelGoalieAnim=pt(a,l.x,l.y,l.angle,c=>this._updateTransform(c),t),this}getState(){const t={};return this._svg.querySelectorAll(`.${this._uid}-token`).forEach(n=>{t[n.id]={x:parseFloat(n.dataset.x),y:parseFloat(n.dataset.y),angle:parseFloat(n.dataset.angle??"0")}}),{tokens:t,shooting:{active:this._shootingActive,target:this._shootingTarget},lang:this._lang,tokenSize:this._tokenSize}}setState(t){return t.tokens&&Object.entries(t.tokens).forEach(([n,s])=>{const e=this._svg.querySelector(`#${n}`);e&&(e.dataset.x=s.x,e.dataset.y=s.y,e.dataset.angle=s.angle??0,this._updateTransform(e))}),t.lang&&this.setLang(t.lang),t.tokenSize&&this.setTokenSize(t.tokenSize),t.shooting&&this.setShootingLine(t.shooting.active),this}reset(){return this._svg.querySelectorAll(`.${this._uid}-token`).forEach(t=>{t.dataset.type==="ball"?(t.dataset.x="600",t.dataset.y="350"):(t.dataset.x=t.dataset.initX,t.dataset.y=t.dataset.initY,t.dataset.angle="0"),this._updateTransform(t)}),this.setShootingLine(!1),this}setPlayers(t){return this._opts.players=t,this._resetTokenGroup("player",t),this}setOpponents(t){return this._opts.opponents=t,this._resetTokenGroup("opponent",t),this}setTeams(t,n){t&&(this._opts.home={...this._opts.home,...t}),n&&(this._opts.away={...this._opts.away,...n});const{home:s,away:e}=this._opts,o=(a,l,c)=>{const u=this._svg.querySelector(`#${a}`);if(!u)return;u.querySelector("path").setAttribute("fill",l),u.querySelector("path").setAttribute("stroke",c);const h=u.querySelector("g");h&&h.setAttribute("stroke",c)};return o(`${this._uid}-sym-player`,s.color,s.accent),o(`${this._uid}-sym-player-goalie`,s.color,s.accent),o(`${this._uid}-sym-opponent`,e.color,e.accent),o(`${this._uid}-sym-opponent-goalie`,e.color,e.accent),this._svg.querySelectorAll('[data-type="player"] text').forEach(a=>a.setAttribute("fill",s.accent)),this._svg.querySelectorAll('[data-type="opponent"] text').forEach(a=>a.setAttribute("fill",e.accent)),this}static get _ALL_LAYER_NAMES(){return["rink","zones","zones-left","zone-attention","zone-awareness","zone-passing-first","zone-danger","zone-slot","zone-attention-right","zone-awareness-left","zone-passing-first-right","zone-danger-right","zone-slot-right"]}loadScenario(t){const n=ft[t];if(!n)return this;for(const s of Z._ALL_LAYER_NAMES)this.setLayer(s,!1);for(const[s,e]of Object.entries(n.layers))this.setLayer(s,e);return this.setPlayers(n.players),this.setOpponents(n.opponents),this.reset(),this}destroy(){this._svg.removeEventListener("mousemove",this._onMouseMove),this._svg.removeEventListener("touchmove",this._onTouchMove),window.removeEventListener("mouseup",this._onMouseUp),window.removeEventListener("touchend",this._onTouchEnd),this._cancelGoalieAnim&&this._cancelGoalieAnim(),this._mount.removeChild(this._svg),this._handlers={}}}const f=new Z(document.getElementById("mount"));let S="en",k=!1,v=50;const r=i=>document.getElementById(i),mt={rink:"btn-rink",zones:"btn-zones","zones-left":"btn-zones-left","zone-attention":"btn-zone-attention","zone-awareness":"btn-zone-awareness","zone-passing-first":"btn-zone-passing-first","zone-danger":"btn-zone-danger","zone-slot":"btn-zone-slot","zone-attention-right":"btn-zone-attention-right","zone-awareness-left":"btn-zone-awareness-left","zone-passing-first-right":"btn-zone-passing-first-right","zone-danger-right":"btn-zone-danger-right","zone-slot-right":"btn-zone-slot-right"};function $(i){for(const[t,n]of Object.entries(mt)){const s=r(n);s&&s.classList.toggle("active",!!i[t])}k=!1,r("btn-shoot").classList.remove("active"),r("btn-ideal").disabled=!0}const xt=["btn-scenario-neutral","btn-scenario-def","btn-scenario-press","btn-scenario-atk","btn-scenario-corner"];function M(i){xt.forEach(t=>r(t).classList.toggle("active",t===i))}r("btn-scenario-neutral").addEventListener("click",()=>{f.loadScenario("neutral"),$({rink:!0}),M("btn-scenario-neutral")});r("btn-scenario-def").addEventListener("click",()=>{f.loadScenario("defensiv-212"),$({rink:!0,"zone-slot":!0}),M("btn-scenario-def")});r("btn-scenario-press").addEventListener("click",()=>{f.loadScenario("forechecking"),$({rink:!0}),M("btn-scenario-press")});r("btn-scenario-atk").addEventListener("click",()=>{f.loadScenario("triangle-attack"),$({rink:!0,"zone-slot-right":!0}),M("btn-scenario-atk")});r("btn-scenario-corner").addEventListener("click",()=>{f.loadScenario("corner-play"),$({rink:!0,"zone-slot-right":!0}),M("btn-scenario-corner")});r("btn-rink").addEventListener("click",()=>{const i=r("btn-rink").classList.toggle("active");f.setLayer("rink",i)});r("btn-zones").addEventListener("click",()=>{const i=r("btn-zones").classList.toggle("active");f.setLayer("zones",i)});r("btn-zone-attention").addEventListener("click",()=>{const i=r("btn-zone-attention").classList.toggle("active");f.setLayer("zone-attention",i)});r("btn-zone-awareness").addEventListener("click",()=>{const i=r("btn-zone-awareness").classList.toggle("active");f.setLayer("zone-awareness",i)});r("btn-zone-passing-first").addEventListener("click",()=>{const i=r("btn-zone-passing-first").classList.toggle("active");f.setLayer("zone-passing-first",i)});r("btn-zone-danger").addEventListener("click",()=>{const i=r("btn-zone-danger").classList.toggle("active");f.setLayer("zone-danger",i)});r("btn-zone-slot").addEventListener("click",()=>{const i=r("btn-zone-slot").classList.toggle("active");f.setLayer("zone-slot",i)});r("btn-zones-left").addEventListener("click",()=>{const i=r("btn-zones-left").classList.toggle("active");f.setLayer("zones-left",i)});r("btn-zone-attention-right").addEventListener("click",()=>{const i=r("btn-zone-attention-right").classList.toggle("active");f.setLayer("zone-attention-right",i)});r("btn-zone-awareness-left").addEventListener("click",()=>{const i=r("btn-zone-awareness-left").classList.toggle("active");f.setLayer("zone-awareness-left",i)});r("btn-zone-passing-first-right").addEventListener("click",()=>{const i=r("btn-zone-passing-first-right").classList.toggle("active");f.setLayer("zone-passing-first-right",i)});r("btn-zone-danger-right").addEventListener("click",()=>{const i=r("btn-zone-danger-right").classList.toggle("active");f.setLayer("zone-danger-right",i)});r("btn-zone-slot-right").addEventListener("click",()=>{const i=r("btn-zone-slot-right").classList.toggle("active");f.setLayer("zone-slot-right",i)});r("btn-shoot").addEventListener("click",()=>{k=!k,f.setShootingLine(k),r("btn-shoot").classList.toggle("active",k),r("btn-ideal").disabled=!k});r("btn-ideal").addEventListener("click",()=>{f.moveGoalieToIdealPosition()});r("btn-lang").addEventListener("click",()=>{S=S==="en"?"de":"en",f.setLang(S),r("btn-lang").textContent=S.toUpperCase(),r("btn-lang").classList.toggle("active",S==="de")});r("btn-reset").addEventListener("click",()=>{f.reset(),k=!1,r("btn-shoot").classList.remove("active"),r("btn-ideal").disabled=!0});r("btn-size-dec").addEventListener("click",()=>{v=Math.max(20,v-5),f.setTokenSize(v),r("size-display").textContent=v});r("btn-size-inc").addEventListener("click",()=>{v=Math.min(100,v+5),f.setTokenSize(v),r("size-display").textContent=v});f.on("tokenMoved",({id:i,x:t,y:n})=>{console.log("moved",i,Math.round(t),Math.round(n))});const x={active:!1,dragging:!1,side:"right",offsetX:0},b="http://www.w3.org/2000/svg",m=()=>document.querySelector("#mount svg"),P=i=>{var t;return(t=m())==null?void 0:t.querySelector(`[id$="-zone-${i}-fill"]`)},At=i=>{var t;return(t=m())==null?void 0:t.querySelector(`[id$="-zone-${i}-label"]`)},E=(i,t)=>{const n=i.createSVGPoint();return n.x=t,n.y=0,n.matrixTransform(i.getScreenCTM().inverse()).x};function U(i,t,n){const s=document.getElementById(`zone-edit-handle-${i}`);s&&(s.querySelector(".edit-line").setAttribute("x1",t),s.querySelector(".edit-line").setAttribute("x2",t),s.querySelector(".edit-pill").setAttribute("x",t-8),s.querySelector(".edit-hit").setAttribute("x",t-16),s.querySelectorAll(".edit-dot").forEach((e,o)=>{e.setAttribute("cx",t),e.setAttribute("cy",n+(o-1)*9)}))}function Q(){const i=P("danger");if(!i)return;const t=parseFloat(i.getAttribute("x")),n=parseFloat(i.getAttribute("width")),s=parseFloat(i.getAttribute("y")),e=parseFloat(i.getAttribute("height")),o=s+e/2;U("left",t,o),U("right",t+n,o);const a=Math.round(t),l=Math.round(n);r("zone-coords").textContent=`x="${a}" y="${Math.round(s)}" width="${l}" height="${Math.round(e)}" rx="50"   →  left: ${a}  right: ${a+l}`}function I(i,t,n,s){const e=n+s/2,o=document.createElementNS(b,"g");o.setAttribute("id",`zone-edit-handle-${i}`),o.style.cursor="ew-resize";const a=document.createElementNS(b,"rect");a.setAttribute("class","edit-hit"),a.setAttribute("x",t-16),a.setAttribute("y",n),a.setAttribute("width",32),a.setAttribute("height",s),a.setAttribute("fill","transparent");const l=document.createElementNS(b,"line");l.setAttribute("class","edit-line"),l.setAttribute("x1",t),l.setAttribute("y1",n),l.setAttribute("x2",t),l.setAttribute("y2",n+s),l.setAttribute("stroke","rgba(255,255,255,0.75)"),l.setAttribute("stroke-width",2),l.setAttribute("stroke-dasharray","8,5"),l.setAttribute("pointer-events","none");const c=document.createElementNS(b,"rect");c.setAttribute("class","edit-pill"),c.setAttribute("x",t-8),c.setAttribute("y",e-22),c.setAttribute("width",16),c.setAttribute("height",44),c.setAttribute("rx",5),c.setAttribute("fill","white"),c.setAttribute("stroke","#666"),c.setAttribute("stroke-width",1.5),c.setAttribute("pointer-events","none");for(let u=0;u<3;u++){const h=document.createElementNS(b,"circle");h.setAttribute("class","edit-dot"),h.setAttribute("cx",t),h.setAttribute("cy",e+(u-1)*9),h.setAttribute("r",2.5),h.setAttribute("fill","#999"),h.setAttribute("pointer-events","none"),o.appendChild(h)}return o.appendChild(a),o.appendChild(l),o.appendChild(c),o.addEventListener("mousedown",u=>{u.preventDefault(),u.stopPropagation();const h=P("danger"),p=i==="right"?parseFloat(h.getAttribute("x"))+parseFloat(h.getAttribute("width")):parseFloat(h.getAttribute("x"));x.offsetX=E(m(),u.clientX)-p,x.side=i,x.dragging=!0}),o}function vt(){if(document.getElementById("zone-edit-handle-right"))return;const i=m(),t=P("danger");if(!i||!t)return;const n=parseFloat(t.getAttribute("x")),s=parseFloat(t.getAttribute("width")),e=parseFloat(t.getAttribute("y")),o=parseFloat(t.getAttribute("height"));i.appendChild(I("left",n,e,o)),i.appendChild(I("right",n+s,e,o))}function N(){var i,t;(i=document.getElementById("zone-edit-handle-left"))==null||i.remove(),(t=document.getElementById("zone-edit-handle-right"))==null||t.remove()}r("btn-edit-danger").addEventListener("click",()=>{x.active=!x.active,r("btn-edit-danger").classList.toggle("active",x.active),x.active?(f.setLayer("zone-danger",!0),r("btn-zone-danger").classList.add("active"),vt(),Q(),r("editor-bar").style.display="flex"):(N(),r("editor-bar").style.display="none")});document.addEventListener("mousemove",i=>{if(!x.dragging)return;const t=m(),n=P("danger");if(!t||!n)return;const s=E(t,i.clientX)-x.offsetX,e=parseFloat(n.getAttribute("x")),o=parseFloat(n.getAttribute("width")),a=e+o;if(x.side==="right")n.setAttribute("width",Math.round(Math.max(e+50,Math.min(1100,s))-e));else{const c=Math.round(Math.max(0,Math.min(a-50,s)));n.setAttribute("x",c),n.setAttribute("width",Math.round(a-c))}const l=At("danger");if(l){const c=parseFloat(n.getAttribute("x")),u=parseFloat(n.getAttribute("width"));l.setAttribute("x",Math.round(c+u/2))}Q()});document.addEventListener("mouseup",()=>{x.dragging=!1});r("btn-copy-coords").addEventListener("click",()=>{var t;const i=r("zone-coords").textContent.split("→")[0].trim();(t=navigator.clipboard)==null||t.writeText(i).catch(()=>{}),r("btn-copy-coords").textContent="Copied!",setTimeout(()=>{r("btn-copy-coords").textContent="Copy"},1500)});const A={active:!1,dragging:null,offsetX:0},L=()=>{var i;return(i=m())==null?void 0:i.querySelector('[id$="-zone-passing-first-fill"]')},kt=()=>{var i;return(i=m())==null?void 0:i.querySelector('[id$="-zone-passing-first-label"]')};function W(i,t){const n=L();if(!n)return;n.setAttribute("width",i-100),n.setAttribute("rx",t);const s=kt();if(s){const e=Math.round((100+i)/2);s.setAttribute("x",e),s.setAttribute("transform",`rotate(-90,${e},350)`)}}function J(){const i=L();if(!i)return;const t=parseFloat(i.getAttribute("x")),n=parseFloat(i.getAttribute("width")),s=parseFloat(i.getAttribute("rx")),e=t+n,o=document.getElementById("pass-edit-handle-right");o&&(o.querySelector(".edit-line").setAttribute("x1",e),o.querySelector(".edit-line").setAttribute("x2",e),o.querySelector(".edit-pill").setAttribute("x",e-8),o.querySelector(".edit-hit").setAttribute("x",e-16),o.querySelectorAll(".edit-dot").forEach((l,c)=>{l.setAttribute("cx",e),l.setAttribute("cy",350+(c-1)*9)}));const a=document.getElementById("pass-edit-handle-rx");if(a){const l=t+s;a.querySelector("circle.rx-hit").setAttribute("cx",l),a.querySelector("circle.rx-vis").setAttribute("cx",l),a.querySelector("line.rx-line").setAttribute("x1",l),a.querySelector("line.rx-line").setAttribute("x2",l)}r("zone-coords").textContent=`x="100" y="100" width="${Math.round(n)}" height="500" rx="${Math.round(s)}"   →  right: ${Math.round(e)}  rx: ${Math.round(s)}`}function wt(){if(document.getElementById("pass-edit-handle-right"))return;const i=m(),t=L();if(!i||!t||t.tagName!=="rect")return;const n=parseFloat(t.getAttribute("x")),s=parseFloat(t.getAttribute("width")),e=parseFloat(t.getAttribute("rx")),o=n+s,a=I("right",o,100,500);a.setAttribute("id","pass-edit-handle-right"),a.querySelectorAll(".edit-dot").forEach((p,y)=>p.setAttribute("cy",350+(y-1)*9)),a.addEventListener("mousedown",p=>{p.preventDefault(),p.stopPropagation();const y=L(),z=parseFloat(y.getAttribute("x"))+parseFloat(y.getAttribute("width"));A.offsetX=E(m(),p.clientX)-z,A.dragging="right"}),i.appendChild(a);const l=document.createElementNS(b,"g");l.setAttribute("id","pass-edit-handle-rx"),l.style.cursor="ew-resize";const c=document.createElementNS(b,"circle");c.setAttribute("class","rx-hit"),c.setAttribute("cx",n+e),c.setAttribute("cy",100),c.setAttribute("r",18),c.setAttribute("fill","transparent");const u=document.createElementNS(b,"line");u.setAttribute("class","rx-line"),u.setAttribute("x1",n+e),u.setAttribute("y1",86),u.setAttribute("x2",n+e),u.setAttribute("y2",114),u.setAttribute("stroke","rgba(255,255,255,0.75)"),u.setAttribute("stroke-width",2),u.setAttribute("pointer-events","none");const h=document.createElementNS(b,"circle");h.setAttribute("class","rx-vis"),h.setAttribute("cx",n+e),h.setAttribute("cy",100),h.setAttribute("r",8),h.setAttribute("fill","#f0a060"),h.setAttribute("stroke","white"),h.setAttribute("stroke-width",2),h.setAttribute("pointer-events","none"),l.appendChild(c),l.appendChild(u),l.appendChild(h),i.appendChild(l),l.addEventListener("mousedown",p=>{p.preventDefault(),p.stopPropagation();const y=L(),z=parseFloat(y.getAttribute("x"))+parseFloat(y.getAttribute("rx"));A.offsetX=E(m(),p.clientX)-z,A.dragging="rx"})}function D(){var i,t;(i=document.getElementById("pass-edit-handle-right"))==null||i.remove(),(t=document.getElementById("pass-edit-handle-rx"))==null||t.remove()}r("btn-edit-passing").addEventListener("click",()=>{x.active&&(x.active=!1,r("btn-edit-danger").classList.remove("active"),N()),A.active=!A.active,r("btn-edit-passing").classList.toggle("active",A.active),A.active?(f.setLayer("zone-passing-first",!0),r("btn-zone-passing-first").classList.add("active"),wt(),J(),r("editor-bar").style.display="flex"):(D(),r("editor-bar").style.display="none")});document.addEventListener("mousemove",i=>{if(!A.dragging)return;const t=m(),n=L();if(!t||!n)return;const s=E(t,i.clientX)-A.offsetX,e=parseFloat(n.getAttribute("x")),o=parseFloat(n.getAttribute("width")),a=parseFloat(n.getAttribute("rx")),l=e+o;if(A.dragging==="right")W(Math.round(Math.max(e+50,Math.min(1100,s))),a);else{const c=Math.max(5,Math.min(o/2,Math.min(250,s-e)));W(l,Math.round(c))}J()});document.addEventListener("mouseup",()=>{A.dragging=null});const g={active:!1,points:[],closed:!1,group:null};function C(i,t,n){const s=i.createSVGPoint();return s.x=t,s.y=n,s.matrixTransform(i.getScreenCTM().inverse())}function tt(){return g.points.map(i=>`${i.x},${i.y}`).join(" ")}function B(){r("zone-coords").textContent=g.points.length?`points="${tt()}"`:"Click on the board to place points. Click the gold dot to close."}function T(){if(!g.group)return;for(;g.group.children.length>1;)g.group.lastChild.remove();const i=g.points;if(!i.length)return;if(g.closed&&i.length>=3){const s=document.createElementNS(b,"polygon");s.setAttribute("points",tt()),s.setAttribute("fill","rgba(160,128,232,0.18)"),s.setAttribute("stroke","rgba(160,128,232,0.85)"),s.setAttribute("stroke-width",1.5),s.setAttribute("pointer-events","none"),g.group.appendChild(s)}const t=i.length,n=g.closed?t:t-1;for(let s=0;s<n;s++){const e=i[s],o=i[(s+1)%t],a=document.createElementNS(b,"line");a.setAttribute("x1",e.x),a.setAttribute("y1",e.y),a.setAttribute("x2",o.x),a.setAttribute("y2",o.y),a.setAttribute("stroke","rgba(255,255,255,0.65)"),a.setAttribute("stroke-width",1.5),g.closed||a.setAttribute("stroke-dasharray","6,3"),a.setAttribute("pointer-events","none"),g.group.appendChild(a)}if(!g.closed&&i.length>=3){const s=document.createElementNS(b,"circle");s.setAttribute("cx",i[0].x),s.setAttribute("cy",i[0].y),s.setAttribute("r",14),s.setAttribute("fill","transparent"),s.setAttribute("stroke","rgba(255,204,0,0.55)"),s.setAttribute("stroke-width",2),s.setAttribute("stroke-dasharray","4,3"),s.setAttribute("pointer-events","none"),g.group.appendChild(s)}i.forEach((s,e)=>{const o=document.createElementNS(b,"circle");o.setAttribute("cx",s.x),o.setAttribute("cy",s.y),o.setAttribute("r",e===0?7:5),o.setAttribute("fill",e===0?"#ffcc00":"white"),o.setAttribute("stroke",e===0?"#aa8800":"#555"),o.setAttribute("stroke-width",1.5),o.setAttribute("cursor","move"),o.addEventListener("mousedown",a=>{a.preventDefault(),a.stopPropagation();const l=e,c=h=>{const p=C(m(),h.clientX,h.clientY);g.points[l]={x:Math.round(p.x),y:Math.round(p.y)},T(),B()},u=()=>{document.removeEventListener("mousemove",c),document.removeEventListener("mouseup",u)};document.addEventListener("mousemove",c),document.addEventListener("mouseup",u)}),g.group.appendChild(o)}),B()}function Lt(){const i=m();g.points=[],g.closed=!1,g.group=document.createElementNS(b,"g"),g.group.setAttribute("id","poly-editor-group"),i.appendChild(g.group);const t=document.createElementNS(b,"rect");t.setAttribute("x",0),t.setAttribute("y",0),t.setAttribute("width",1200),t.setAttribute("height",700),t.setAttribute("fill","transparent"),t.setAttribute("cursor","crosshair"),g.group.appendChild(t),t.addEventListener("click",n=>{if(g.closed)return;const s=C(m(),n.clientX,n.clientY),e=Math.round(s.x),o=Math.round(s.y);if(g.points.length>=3){const a=e-g.points[0].x,l=o-g.points[0].y;if(Math.sqrt(a*a+l*l)<20){et();return}}g.points.push({x:e,y:o}),T()}),r("btn-poly-close").style.display="",r("btn-poly-undo").style.display="",r("btn-poly-clear").style.display=""}function et(){g.points.length<3||(g.closed=!0,r("btn-poly-close").style.display="none",T())}function nt(){var i;(i=document.getElementById("poly-editor-group"))==null||i.remove(),g.group=null,g.points=[],g.closed=!1,r("btn-poly-close").style.display="none",r("btn-poly-undo").style.display="none",r("btn-poly-clear").style.display="none",r("editor-bar").style.display="none"}r("btn-poly-editor").addEventListener("click",()=>{x.active&&(x.active=!1,r("btn-edit-danger").classList.remove("active"),N()),A.active&&(A.active=!1,r("btn-edit-passing").classList.remove("active"),D()),d.active&&(d.active=!1,r("btn-line-editor").classList.remove("active"),st()),g.active=!g.active,r("btn-poly-editor").classList.toggle("active",g.active),g.active?(Lt(),r("editor-bar").style.display="flex",B()):nt()});r("btn-poly-close").addEventListener("click",et);r("btn-poly-undo").addEventListener("click",()=>{g.closed?(g.closed=!1,r("btn-poly-close").style.display=""):g.points.pop(),T()});r("btn-poly-clear").addEventListener("click",()=>{d.active||(g.points=[],g.closed=!1,r("btn-poly-close").style.display="",T())});const d={active:!1,lines:[],placing:!1,tempStart:null,group:null};function _t(i){if(i.querySelector("#line-tool-arrow"))return;const t=i.querySelector("defs");if(!t)return;const n=document.createElementNS(b,"marker");n.setAttribute("id","line-tool-arrow"),n.setAttribute("markerWidth","8"),n.setAttribute("markerHeight","8"),n.setAttribute("refX","7"),n.setAttribute("refY","3"),n.setAttribute("orient","auto");const s=document.createElementNS(b,"path");s.setAttribute("d","M0,0 L0,6 L8,3 z"),s.setAttribute("fill","rgba(64,200,232,0.9)"),n.appendChild(s),t.appendChild(n)}function _(){if(d.group){if(d.group.querySelector("#line-tool-preview"),Array.from(d.group.children).forEach(i=>{i!==d.group.firstChild&&i.id!=="line-tool-preview"&&i.remove()}),d.lines.forEach((i,t)=>{const n=document.createElementNS(b,"line");n.setAttribute("x1",i.x1),n.setAttribute("y1",i.y1),n.setAttribute("x2",i.x2),n.setAttribute("y2",i.y2),n.setAttribute("stroke","rgba(64,200,232,0.85)"),n.setAttribute("stroke-width","2"),n.setAttribute("marker-end","url(#line-tool-arrow)"),n.setAttribute("pointer-events","none"),d.group.appendChild(n),[["x1","y1",!1],["x2","y2",!0]].forEach(([s,e,o])=>{const a=document.createElementNS(b,"circle");a.setAttribute("cx",i[s]),a.setAttribute("cy",i[e]),a.setAttribute("r",5),a.setAttribute("fill",o?"#ffcc00":"white"),a.setAttribute("stroke",o?"#aa8800":"#555"),a.setAttribute("stroke-width",1.5),a.setAttribute("cursor","move"),a.addEventListener("mousedown",l=>{l.preventDefault(),l.stopPropagation();const c=h=>{const p=C(m(),h.clientX,h.clientY);d.lines[t][s]=Math.round(p.x),d.lines[t][e]=Math.round(p.y),_()},u=()=>{document.removeEventListener("mousemove",c),document.removeEventListener("mouseup",u)};document.addEventListener("mousemove",c),document.addEventListener("mouseup",u)}),d.group.appendChild(a)})}),d.placing&&d.tempStart){const i=document.createElementNS(b,"circle");i.setAttribute("cx",d.tempStart.x),i.setAttribute("cy",d.tempStart.y),i.setAttribute("r",5),i.setAttribute("fill","white"),i.setAttribute("stroke","#555"),i.setAttribute("stroke-width",1.5),i.setAttribute("pointer-events","none"),d.group.appendChild(i)}it()}}function it(){const i=d.lines[d.lines.length-1];r("zone-coords").textContent=i?`x1="${i.x1}" y1="${i.y1}" x2="${i.x2}" y2="${i.y2}"`:"Click to place start point, click again to complete the line."}function zt(){const i=m();_t(i),d.lines=[],d.placing=!1,d.tempStart=null,d.group=document.createElementNS(b,"g"),d.group.setAttribute("id","line-tool-group"),i.appendChild(d.group);const t=document.createElementNS(b,"rect");t.setAttribute("x",0),t.setAttribute("y",0),t.setAttribute("width",1200),t.setAttribute("height",700),t.setAttribute("fill","transparent"),t.setAttribute("cursor","crosshair"),d.group.appendChild(t),t.addEventListener("click",n=>{var a;const s=C(m(),n.clientX,n.clientY),e=Math.round(s.x),o=Math.round(s.y);d.placing?(d.lines.push({x1:d.tempStart.x,y1:d.tempStart.y,x2:e,y2:o}),d.placing=!1,d.tempStart=null,(a=d.group.querySelector("#line-tool-preview"))==null||a.remove(),_()):(d.tempStart={x:e,y:o},d.placing=!0,_())}),r("btn-poly-close").style.display="none",r("btn-poly-undo").style.display="",r("btn-poly-clear").style.display=""}function st(){var i;(i=document.getElementById("line-tool-group"))==null||i.remove(),d.group=null,d.lines=[],d.placing=!1,d.tempStart=null,r("btn-poly-undo").style.display="none",r("btn-poly-clear").style.display="none",r("editor-bar").style.display="none"}document.addEventListener("mousemove",i=>{if(!d.active||!d.placing||!d.group)return;const t=C(m(),i.clientX,i.clientY);let n=d.group.querySelector("#line-tool-preview");n||(n=document.createElementNS(b,"line"),n.setAttribute("id","line-tool-preview"),n.setAttribute("stroke","rgba(64,200,232,0.4)"),n.setAttribute("stroke-width","1.5"),n.setAttribute("stroke-dasharray","6,3"),n.setAttribute("pointer-events","none"),d.group.appendChild(n)),n.setAttribute("x1",d.tempStart.x),n.setAttribute("y1",d.tempStart.y),n.setAttribute("x2",Math.round(t.x)),n.setAttribute("y2",Math.round(t.y))});r("btn-line-editor").addEventListener("click",()=>{x.active&&(x.active=!1,r("btn-edit-danger").classList.remove("active"),N()),A.active&&(A.active=!1,r("btn-edit-passing").classList.remove("active"),D()),g.active&&(g.active=!1,r("btn-poly-editor").classList.remove("active"),nt()),d.active=!d.active,r("btn-line-editor").classList.toggle("active",d.active),d.active?(zt(),r("editor-bar").style.display="flex",it()):st()});r("btn-poly-undo").addEventListener("click",()=>{var i;d.active&&(d.placing?(d.placing=!1,d.tempStart=null,(i=d.group.querySelector("#line-tool-preview"))==null||i.remove(),_()):(d.lines.pop(),_()))});r("btn-poly-clear").addEventListener("click",()=>{var i;d.active&&(d.lines=[],d.placing=!1,d.tempStart=null,(i=d.group.querySelector("#line-tool-preview"))==null||i.remove(),_())});
