// ==========================================================================
// WAHRHEIT ODER LÜGE - CLIENT LOGIC & HYBRID SYNC (LOCAL + GITHUB/MQTT)
// ==========================================================================

const TRANSLATIONS = {
  de: {
    appTitle: "Wahrheit oder Lüge",
    appSubtitle: "2 Wahrheiten, 1 Lüge",
    loggedAs: "Eingeloggt als:",
    pts: "Punkte",
    guest: "Gast (Bitte auswählen)",
    participantListTitle: "Teilnehmerliste (27 Spieler)",
    selectPrompt: "Tippe auf deinen Namen, um dich einzuloggen oder deine Aussagen zu bearbeiten:",
    setupTitle: "✍️ Deine 3 Aussagen",
    setupDesc: "Schreibe 3 Aussagen über dich: 2 sind wahr, 1 ist gelogen. Markiere deine Lüge!",
    chooseInputLang: "Sprache zum Ausfüllen wählen:",
    stmt1: "Aussage 1",
    stmt2: "Aussage 2",
    stmt3: "Aussage 3",
    truthBtn: "Wahrheit",
    lieBtn: "Lüge ❌",
    saveBtn: "💾 Aussagen speichern",
    savedSuccess: "Deine Aussagen wurden erfolgreich gespeichert! 🎉",
    waitingTitle: "Warte auf die nächste Spielrunde...",
    waitingDesc: "Der Spielleiter wählt gleich den nächsten Teilnehmer aus. Mache dich bereit zum Raten!",
    turnTitle: "{name} ist an der Reihe!",
    whichIsLie: "Welche Aussage ist die Lüge? Kreuze an!",
    yourTurnSelf: "Du bist an der Reihe! Lies deine Aussagen laut vor. 🎤",
    cardA: "Karte A",
    cardB: "Karte B",
    cardC: "Karte C",
    truthLabel: "✅ WAHRHEIT",
    lieLabel: "❌ LÜGE",
    yourVote: "Deine Wahl",
    correctMsg: "+100 Punkte! Großartig geraten! 🎉",
    wrongMsg: "Leider daneben! Das war die Wahrheit. 🍂",
    modTitle: "Spielleiter",
    ready: "Bereit ✅",
    pending: "Offen ✍️"
  },
  en: {
    appTitle: "Truth or Lie",
    appSubtitle: "Two Truths and a Lie",
    loggedAs: "Logged in as:",
    pts: "Points",
    guest: "Guest (Please select)",
    participantListTitle: "Participant List (27 Players)",
    selectPrompt: "Tap on your name to log in or update your statements:",
    setupTitle: "✍️ Your 3 Statements",
    setupDesc: "Write 3 statements about yourself: 2 are true, 1 is a lie. Mark your lie!",
    chooseInputLang: "Select language for input:",
    stmt1: "Statement 1",
    stmt2: "Statement 2",
    stmt3: "Statement 3",
    truthBtn: "Truth",
    lieBtn: "Lie ❌",
    saveBtn: "💾 Save Statements",
    savedSuccess: "Your statements have been saved! 🎉",
    waitingTitle: "Waiting for next round...",
    waitingDesc: "The host will start the next turn shortly. Get ready to vote!",
    turnTitle: "It's {name}'s turn!",
    whichIsLie: "Which statement is the lie? Cast your vote!",
    yourTurnSelf: "It's your turn! Read your statements out loud. 🎤",
    cardA: "Card A",
    cardB: "Card B",
    cardC: "Card C",
    truthLabel: "✅ TRUTH",
    lieLabel: "❌ LIE",
    yourVote: "Your Vote",
    correctMsg: "+100 Points! Awesome guess! 🎉",
    wrongMsg: "Wrong guess! That was the truth. 🍂",
    modTitle: "Host",
    ready: "Ready ✅",
    pending: "Pending ✍️"
  },
  krj: {
    appTitle: "Kamatuoran ukon Butig",
    appSubtitle: "Darwa ka kamatuoran, sangka butig",
    loggedAs: "Nakasulod bilang:",
    pts: "Puntos",
    guest: "Bisita (Pilia ang ngaran)",
    participantListTitle: "Listahan kang mga Tawo (27 ka Imbitado)",
    selectPrompt: "Pinduta ang imo ngaran para mag-umpisa ukon mag-ilis kang sugid:",
    setupTitle: "✍️ Ang imo 3 ka sugid",
    setupDesc: "Magsulat kang 3 ka sugid parte kanimo: 2 ang matuod, 1 ang butig. Markahi ang butig!",
    chooseInputLang: "Pilia ang pulong sa pagsulat:",
    stmt1: "Sugid 1",
    stmt2: "Sugid 2",
    stmt3: "Sugid 3",
    truthBtn: "Matuod",
    lieBtn: "Butig ❌",
    saveBtn: "💾 I-save ang mga Sugid",
    savedSuccess: "Na-save run ang imo mga sugid! 🎉",
    waitingTitle: "Hulat lang sa masunod nga hampang...",
    waitingDesc: "Ang tag-patigayon mapili kang masunod nga tawo. Maghanda sa pagboto!",
    turnTitle: "Si {name} run ang masunod!",
    whichIsLie: "Diin ang butig? Pilia ang sabat mo!",
    yourTurnSelf: "Ikaaw run ang masunod! Basaha sing mabaskog ang imo mga sugid. 🎤",
    cardA: "Kard A",
    cardB: "Kard B",
    cardC: "Kard C",
    truthLabel: "✅ KAMATUORAN",
    lieLabel: "❌ BUTIG",
    yourVote: "Imo Boto",
    correctMsg: "+100 Puntos! Husto gid ang imo pili! 🎉",
    wrongMsg: "Sala ang ginpili mo! Matuod gali ato. 🍂",
    modTitle: "Moderator",
    ready: "Handa run ✅",
    pending: "Wala pa ✍️"
  }
};

const DEFAULT_PARTICIPANTS = [
  { id: "p_1", name: "Princess", sticker: "assets/stickers/Princess.png" },
  { id: "p_2", name: "Chris P", sticker: "assets/stickers/Christian Pohl.png" },
  { id: "p_3", name: "Cyro", sticker: "assets/stickers/Cyro.png" },
  { id: "p_4", name: "Cobie", sticker: "assets/stickers/Cobie.png" },
  { id: "p_5", name: "Mercy", sticker: "assets/stickers/Mercy.png" },
  { id: "p_6", name: "Neil", sticker: "assets/stickers/Neil.png" },
  { id: "p_7", name: "Nick", sticker: "assets/stickers/Nick.png" },
  { id: "p_8", name: "Delia", sticker: "assets/stickers/Delia.png" },
  { id: "p_9", name: "Avelino", sticker: "assets/stickers/Avelino Alcantara.png" },
  { id: "p_10", name: "Jessica", sticker: "assets/stickers/Jessica.png" },
  { id: "p_11", name: "Daeve", sticker: "assets/stickers/Daeve.png" },
  { id: "p_12", name: "Freundin", sticker: "assets/stickers/Freundin.png" },
  { id: "p_13", name: "Freund", sticker: "assets/stickers/Freund.png" },
  { id: "p_14", name: "Chit", sticker: "assets/stickers/Tante Chit.png" },
  { id: "p_15", name: "Rupert", sticker: "assets/stickers/Ruppert K.png" },
  { id: "p_16", name: "Christian K.", sticker: "assets/stickers/Christian König.png" },
  { id: "p_17", name: "Christine", sticker: "assets/stickers/Christine.png" },
  { id: "p_18", "name": "Girly 1", sticker: "assets/stickers/Girly 1.png" },
  { id: "p_19", "name": "Girly 2", sticker: "assets/stickers/Girly 2.png" },
  { id: "p_20", name: "Clemens", sticker: "assets/stickers/Clemens.png" },
  { id: "p_21", name: "Carmela", sticker: "assets/stickers/Carmela.png" },
  { id: "p_22", name: "Patrick-w", sticker: "assets/stickers/Patrick mit Malia.png" },
  { id: "p_23", name: "Leonie", sticker: "assets/stickers/Leonie.png" },
  { id: "p_24", name: "Malia", sticker: "assets/stickers/Patrick mit Malia.png" },
  { id: "p_25", name: "Emily", sticker: "assets/stickers/Emily.png" },
  { id: "p_26", name: "Viktoria", sticker: "assets/stickers/Viktoria.png" },
  { id: "p_27", name: "Christian", sticker: "assets/stickers/Christian.png" }
];

function createInitialState() {
  const participants = DEFAULT_PARTICIPANTS.map(p => ({
    id: p.id,
    name: p.name,
    sticker: p.sticker,
    statements: { de: ["", "", ""], en: ["", "", ""], krj: ["", "", ""] },
    lieIndex: 2,
    hasSubmitted: false
  }));
  const scores = {};
  participants.forEach(p => scores[p.id] = 0);
  return {
    title: "Wahrheit oder Lüge",
    moderatorPin: "1234",
    participants,
    currentRound: { activeParticipantId: null, status: "waiting", votes: {} },
    scores,
    history: []
  };
}

// State
let currentLang = localStorage.getItem("wol_lang") || "de";
let inputLang = "de";
let currentUserId = localStorage.getItem("wol_user_id") || null;
let isModerator = false;
let gameState = createInitialState();
let localDraftStatements = { de: ["", "", ""], en: ["", "", ""], krj: ["", "", ""] };
let localLieIndex = 2;
let qrCodeInstance = null;

// Determine Sync Mode: Local (ws) or Cloud/GitHub (MQTT)
const isLocalMode = location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.port === "8000";
let ws = null;
let mqttClient = null;
const MQTT_TOPIC = "wol/laschensky2026/events";

// Audio Synthesizer
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
  try {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'click') {
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'correct') {
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      osc.frequency.setValueAtTime(1046.50, now + 0.3);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'wrong') {
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.setValueAtTime(200, now + 0.15);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (e) {}
}

// ==========================================================================
// NETWORKING: LOCAL WEBSOCKET OR CLOUD MQTT
// ==========================================================================
function initNetworking() {
  if (isLocalMode) {
    initLocalWS();
  } else {
    initCloudMQTT();
  }
}

function initLocalWS() {
  const protocol = location.protocol === "https:" ? "wss:" : "ws:";
  const wsUrl = `${protocol}//${location.host}/ws`;
  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log("Local WebSocket connected!");
    if (currentUserId) sendAction("register_player", { participantId: currentUserId });
    const savedPin = sessionStorage.getItem("wol_mod_pin");
    if (savedPin) sendAction("auth_moderator", { pin: savedPin });
  };

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.type === "state_update") {
        gameState = msg.data;
        if (msg.isModerator !== undefined) isModerator = msg.isModerator;
        if (msg.serverInfo && msg.serverInfo.url) {
          lanServerUrl = msg.serverInfo.url;
        }
        setupQRCode(lanServerUrl || (msg.serverInfo ? msg.serverInfo.url : window.location.href));
        renderApp();
      } else if (msg.type === "auth_success") {
        isModerator = true;
        document.getElementById("mod-auth-screen").style.display = "none";
        document.getElementById("mod-dashboard").style.display = "block";
      } else if (msg.type === "auth_error") {
        const errEl = document.getElementById("mod-pin-error");
        errEl.textContent = msg.message || "Falscher PIN!";
        errEl.style.display = "block";
      }
    } catch (err) {
      console.error("WS Parse error:", err);
    }
  };

  ws.onclose = () => {
    setTimeout(initLocalWS, 2000);
  };
}

function initCloudMQTT() {
  console.log("Starting Cloud MQTT synchronization for GitHub Pages...");
  const savedState = localStorage.getItem("wol_cloud_state");
  if (savedState) {
    try { gameState = JSON.parse(savedState); } catch(e) {}
  }

  setupQRCode(window.location.href.split('#')[0]);

  if (window.mqtt) {
    const brokerUrl = "wss://broker.hivemq.com:8884/mqtt";
    const clientId = "wol_" + Math.random().toString(16).substring(2, 10);
    mqttClient = mqtt.connect(brokerUrl, { clientId, clean: true, reconnectPeriod: 2000 });

    mqttClient.on("connect", () => {
      console.log("Cloud MQTT connected to broker!");
      mqttClient.subscribe(MQTT_TOPIC);
      // Ask moderator for latest state
      mqttClient.publish(MQTT_TOPIC, JSON.stringify({ action: "request_sync" }));
    });

    mqttClient.on("message", (topic, payload) => {
      try {
        const data = JSON.parse(payload.toString());
        handleCloudEvent(data);
      } catch (err) {
        console.error("MQTT parse err:", err);
      }
    });
  } else {
    console.warn("MQTT library not loaded, using local storage fallback");
  }

  // Restore moderator session if previously authenticated
  if (sessionStorage.getItem("wol_mod_pin") === "1234") {
    isModerator = true;
    document.getElementById("mod-auth-screen").style.display = "none";
    document.getElementById("mod-dashboard").style.display = "block";
  }

  renderApp();
}

function sendAction(action, payload = {}) {
  const msg = { action, ...payload };
  if (isLocalMode) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));
    }
  } else {
    handleCloudEvent(msg); // Local optimism
    if (mqttClient && mqttClient.connected) {
      mqttClient.publish(MQTT_TOPIC, JSON.stringify(msg));
    }
  }
}

function handleCloudEvent(msg) {
  const action = msg.action;

  if (action === "request_sync") {
    if (isModerator && mqttClient) {
      mqttClient.publish(MQTT_TOPIC, JSON.stringify({ action: "sync_state", state: gameState }));
    }
  } else if (action === "sync_state" && msg.state) {
    gameState = msg.state;
    saveCloudState();
    renderApp();
  } else if (action === "save_statements") {
    const p = gameState.participants.find(p => p.id === msg.participantId);
    if (p) {
      p.statements = msg.statements;
      p.lieIndex = msg.lieIndex;
      p.hasSubmitted = true;
      saveCloudState();
      renderApp();
    }
  } else if (action === "start_round") {
    gameState.currentRound = {
      activeParticipantId: msg.participantId,
      status: "voting",
      votes: {}
    };
    saveCloudState();
    renderApp();
  } else if (action === "cast_vote") {
    if (gameState.currentRound.status === "voting") {
      gameState.currentRound.votes[msg.voterId] = msg.statementIndex;
      saveCloudState();
      renderApp();
    }
  } else if (action === "reveal_round") {
    const curr = gameState.currentRound;
    const activeP = gameState.participants.find(p => p.id === curr.activeParticipantId);
    if (activeP && curr.status === "voting") {
      curr.status = "revealed";
      curr.correctLieIndex = activeP.lieIndex !== undefined ? activeP.lieIndex : 2;
      for (const [vId, choice] of Object.entries(curr.votes)) {
        if (choice === curr.correctLieIndex) {
          gameState.scores[vId] = (gameState.scores[vId] || 0) + 100;
        }
      }
      saveCloudState();
      renderApp();
    }
  } else if (action === "next_round") {
    gameState.currentRound = { activeParticipantId: null, status: "waiting", votes: {} };
    saveCloudState();
    renderApp();
  } else if (action === "reset_scores") {
    gameState.participants.forEach(p => gameState.scores[p.id] = 0);
    gameState.history = [];
    gameState.currentRound = { activeParticipantId: null, status: "waiting", votes: {} };
    saveCloudState();
    renderApp();
  }
}

function saveCloudState() {
  if (!isLocalMode) {
    localStorage.setItem("wol_cloud_state", JSON.stringify(gameState));
  }
}

// ==========================================================================
// RENDER UI
// ==========================================================================
function renderApp() {
  if (!gameState) return;
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.de;

  document.getElementById("ui-app-title").textContent = t.appTitle;
  document.getElementById("ui-app-subtitle").textContent = t.appSubtitle;
  document.getElementById("ui-logged-in-as").textContent = t.loggedAs;
  document.getElementById("ui-pts").textContent = t.pts;
  document.getElementById("ui-participant-list-title").textContent = t.participantListTitle;
  document.getElementById("ui-select-prompt").textContent = t.selectPrompt;
  document.getElementById("ui-setup-title").textContent = t.setupTitle;
  document.getElementById("ui-setup-desc").innerHTML = t.setupDesc;
  document.getElementById("ui-input-lang-label").textContent = t.chooseInputLang;
  document.getElementById("btn-save-statements").textContent = t.saveBtn;
  document.getElementById("ui-waiting-title").textContent = t.waitingTitle;
  document.getElementById("ui-waiting-desc").textContent = t.waitingDesc;

  const currentUser = gameState.participants.find(p => p.id === currentUserId);
  const userDispName = document.getElementById("user-display-name");
  const userScore = document.getElementById("user-score");
  const avatarContainer = document.getElementById("user-avatar-container");

  if (currentUser) {
    userDispName.textContent = currentUser.name;
    userScore.textContent = gameState.scores[currentUser.id] || 0;
    if (currentUser.sticker) {
      avatarContainer.innerHTML = `<img src="${currentUser.sticker}" class="user-avatar-mini" alt="${currentUser.name}">`;
    } else {
      avatarContainer.innerHTML = `<div class="user-avatar-placeholder">${currentUser.name.charAt(0)}</div>`;
    }
  } else {
    userDispName.textContent = t.guest;
    userScore.textContent = 0;
    avatarContainer.innerHTML = `<div class="user-avatar-placeholder">?</div>`;
  }

  renderParticipantsGrid(t);
  renderSetupBox(currentUser, t);
  renderGameStage(currentUser, t);

  if (isModerator) {
    renderModeratorCockpit();
  }
}

function renderParticipantsGrid(t) {
  const grid = document.getElementById("participants-grid");
  grid.innerHTML = "";

  gameState.participants.forEach(p => {
    const card = document.createElement("div");
    card.className = "participant-card" + (p.id === currentUserId ? " selected" : "");
    card.onclick = () => selectParticipant(p.id);

    const avatarHtml = p.sticker
      ? `<img src="${p.sticker}" alt="${p.name}">`
      : `<div class="avatar-fallback">${p.name.charAt(0)}</div>`;

    const statusClass = p.hasSubmitted ? "ready" : "pending";
    const statusText = p.hasSubmitted ? t.ready : t.pending;

    card.innerHTML = `
      ${avatarHtml}
      <span class="p-name">${p.name}</span>
      <span class="p-status ${statusClass}">${statusText}</span>
    `;
    grid.appendChild(card);
  });
}

function selectParticipant(pId) {
  currentUserId = pId;
  localStorage.setItem("wol_user_id", pId);
  sendAction("register_player", { participantId: pId });

  const user = gameState.participants.find(p => p.id === pId);
  if (user && user.statements) {
    localDraftStatements = JSON.parse(JSON.stringify(user.statements));
    localLieIndex = user.lieIndex !== undefined && user.lieIndex !== null ? user.lieIndex : 2;
  }
  
  playSound("click");
  renderApp();
}

function renderSetupBox(currentUser, t) {
  const setupBox = document.getElementById("section-statement-setup");
  if (!currentUser) {
    setupBox.style.display = "none";
    return;
  }

  setupBox.style.display = "block";
  const langStmts = localDraftStatements[inputLang] || ["", "", ""];
  for (let i = 0; i < 3; i++) {
    const txtArea = document.getElementById(`input-stmt-${i}`);
    if (document.activeElement !== txtArea) {
      txtArea.value = langStmts[i] || "";
    }
    const card = document.getElementById(`card-input-${i}`);
    const btn = document.getElementById(`lie-btn-${i}`);
    if (localLieIndex === i) {
      card.className = "statement-input-card is-lie";
      btn.textContent = t.lieBtn;
    } else {
      card.className = "statement-input-card is-truth";
      btn.textContent = t.truthBtn;
    }
  }
}

function renderGameStage(currentUser, t) {
  const waitingEl = document.getElementById("stage-waiting");
  const activeEl = document.getElementById("stage-active-round");
  const currRound = gameState.currentRound || {};

  if (!currRound.activeParticipantId || currRound.status === "waiting") {
    waitingEl.style.display = "block";
    activeEl.style.display = "none";
    return;
  }

  waitingEl.style.display = "none";
  activeEl.style.display = "block";

  const activeP = gameState.participants.find(p => p.id === currRound.activeParticipantId);
  if (!activeP) return;

  const avatarWrap = document.getElementById("active-player-avatar-wrap");
  if (activeP.sticker) {
    avatarWrap.innerHTML = `<img src="${activeP.sticker}" class="stage-avatar" alt="${activeP.name}">`;
  } else {
    avatarWrap.innerHTML = `<div class="stage-avatar-fallback">${activeP.name.charAt(0)}</div>`;
  }

  const isSelf = currentUser && currentUser.id === activeP.id;
  const promptText = document.getElementById("stage-prompt-text");
  const playerTitle = document.getElementById("active-player-title");

  playerTitle.textContent = t.turnTitle.replace("{name}", activeP.name);
  promptText.textContent = isSelf ? t.yourTurnSelf : t.whichIsLie;

  const stmts = (activeP.statements && activeP.statements[currentLang]) ||
                (activeP.statements && activeP.statements.de) ||
                ["", "", ""];

  const subLang = currentLang === "krj" ? "en" : (currentLang === "en" ? "de" : "en");
  const subStmts = (activeP.statements && activeP.statements[subLang]) || [];

  const myVote = currentUser ? currRound.votes[currentUser.id] : undefined;
  const isRevealed = currRound.status === "revealed";
  const correctLie = isRevealed ? (currRound.correctLieIndex !== undefined ? currRound.correctLieIndex : activeP.lieIndex) : null;

  for (let i = 0; i < 3; i++) {
    const cardEl = document.getElementById(`index-card-${i}`);
    const textEl = document.getElementById(`stmt-text-${i}`);
    const subEl = document.getElementById(`stmt-sub-${i}`);
    const voteTag = document.getElementById(`card-vote-tag-${i}`);
    const stampEl = document.getElementById(`card-stamp-${i}`);

    textEl.textContent = stmts[i] || `[Aussage ${i+1} noch nicht eingetragen]`;

    if (subStmts[i] && subStmts[i].trim().length > 0 && subStmts[i] !== stmts[i]) {
      subEl.textContent = subStmts[i];
      subEl.style.display = "block";
    } else {
      subEl.style.display = "none";
    }

    cardEl.className = "index-card";
    stampEl.textContent = "";

    if (myVote === i) {
      cardEl.classList.add("selected-vote");
      voteTag.textContent = `⭐ ${t.yourVote}`;
    } else {
      voteTag.textContent = "";
    }

    if (isRevealed && correctLie !== null) {
      if (i === correctLie) {
        cardEl.classList.add("is-revealed-lie");
        stampEl.textContent = t.lieLabel;
      } else {
        cardEl.classList.add("is-revealed-truth");
        stampEl.textContent = t.truthLabel;
      }
    }

    cardEl.onclick = () => {
      if (isRevealed || isSelf || !currentUser) return;
      playSound("click");
      sendAction("cast_vote", {
        voterId: currentUser.id,
        statementIndex: i
      });
    };
  }

  const resultCard = document.getElementById("round-result-card");
  const resultMsg = document.getElementById("result-message");
  if (isRevealed && correctLie !== null) {
    resultCard.style.display = "block";
    const letter = ["A", "B", "C"][correctLie];
    if (!isSelf && myVote !== undefined) {
      if (myVote === correctLie) {
        resultCard.className = "round-result-card success";
        resultMsg.innerHTML = `<strong>${t.correctMsg}</strong> (Karte ${letter})`;
        if (!resultCard.dataset.celebrated) {
          playSound("correct");
          if (window.confetti) confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          resultCard.dataset.celebrated = "true";
        }
      } else {
        resultCard.className = "round-result-card wrong";
        resultMsg.innerHTML = `<strong>${t.wrongMsg}</strong> Die Lüge war Karte ${letter}.`;
        if (!resultCard.dataset.celebrated) {
          playSound("wrong");
          resultCard.dataset.celebrated = "true";
        }
      }
    } else {
      resultCard.className = "round-result-card";
      resultMsg.innerHTML = `Die Lüge war <strong>Karte ${letter}</strong>!`;
    }
  } else {
    resultCard.style.display = "none";
    delete resultCard.dataset.celebrated;
  }
}

function renderModeratorCockpit() {
  const selectEl = document.getElementById("mod-player-select");
  const currRound = gameState.currentRound || {};

  if (selectEl.children.length === 0) {
    gameState.participants.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = `${p.name} ${p.hasSubmitted ? '✅' : '✍️'}`;
      selectEl.appendChild(opt);
    });
  }

  if (currRound.activeParticipantId) {
    selectEl.value = currRound.activeParticipantId;
  }

  const voteCount = Object.keys(currRound.votes || {}).length;
  const totalEligible = gameState.participants.length - 1;
  const statusEl = document.getElementById("mod-voting-status");

  if (currRound.status === "voting") {
    const activeP = gameState.participants.find(p => p.id === currRound.activeParticipantId);
    const lieLetter = activeP && activeP.lieIndex !== undefined ? ["A", "B", "C"][activeP.lieIndex] : "?";
    statusEl.innerHTML = `🎮 <strong>Abstimmung aktiv!</strong> Eingegangen: <strong>${voteCount} / ${totalEligible}</strong> Stimmen. <br><span style="color: var(--danger); font-weight: 700;">(Geheime Lüge: Karte ${lieLetter})</span>`;
  } else if (currRound.status === "revealed") {
    statusEl.innerHTML = `🎉 <strong>Runde aufgelöst!</strong> Punkte wurden vergeben. Klicke auf 'Nächste Runde'.`;
  } else {
    statusEl.textContent = "Keine aktive Runde. Wähle einen Teilnehmer und klicke 'Runde starten'.";
  }

  const lbBody = document.getElementById("leaderboard-body");
  lbBody.innerHTML = "";
  const sorted = [...gameState.participants].sort((a, b) => (gameState.scores[b.id] || 0) - (gameState.scores[a.id] || 0));

  sorted.forEach((p, idx) => {
    const row = document.createElement("tr");
    const medal = idx === 0 ? "🥇" : (idx === 1 ? "🥈" : (idx === 2 ? "🥉" : `${idx + 1}.`));
    row.innerHTML = `
      <td><strong>${medal}</strong></td>
      <td>${p.name}</td>
      <td><strong>${gameState.scores[p.id] || 0} Pkt</strong></td>
    `;
    lbBody.appendChild(row);
  });
}

const GITHUB_URL = "https://greuli.github.io/wahrheit-oder-luege/";
let lanServerUrl = "";
let activeQrTarget = "wifi";

function setupQRCode(url) {
  const container = document.getElementById("qrcode-container");
  const urlEl = document.getElementById("mod-qr-url");
  if (!container) return;

  let finalUrl = url;
  if (activeQrTarget === "github") {
    finalUrl = GITHUB_URL;
  } else {
    if (lanServerUrl) {
      finalUrl = lanServerUrl;
    } else if (url && !url.includes("localhost") && !url.includes("127.0.0.1")) {
      finalUrl = url;
    } else {
      finalUrl = "http://192.168.178.25:8000";
    }
  }

  if (!finalUrl) finalUrl = GITHUB_URL;

  urlEl.textContent = finalUrl;
  container.innerHTML = "";
  if (window.QRCode) {
    new QRCode(container, {
      text: finalUrl,
      width: 200,
      height: 200,
      colorDark: "#271f1a",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });
  }
}

// ==========================================================================
// EVENT LISTENERS
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentLang = btn.dataset.lang;
      localStorage.setItem("wol_lang", currentLang);
      playSound("click");
      renderApp();
    });
  });

  const accHeader = document.getElementById("accordion-header");
  const accContent = document.getElementById("accordion-content");
  const accArrow = document.getElementById("accordion-arrow");
  accHeader.addEventListener("click", () => {
    accContent.classList.toggle("open");
    accArrow.classList.toggle("open");
  });

  document.querySelectorAll(".lang-input-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      for (let i = 0; i < 3; i++) {
        localDraftStatements[inputLang][i] = document.getElementById(`input-stmt-${i}`).value;
      }
      document.querySelectorAll(".lang-input-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      inputLang = tab.dataset.inlang;
      playSound("click");
      const currentUser = gameState.participants.find(p => p.id === currentUserId);
      renderSetupBox(currentUser, TRANSLATIONS[currentLang] || TRANSLATIONS.de);
    });
  });

  for (let i = 0; i < 3; i++) {
    document.getElementById(`lie-btn-${i}`).addEventListener("click", () => {
      localLieIndex = i;
      playSound("click");
      const currentUser = gameState.participants.find(p => p.id === currentUserId);
      renderSetupBox(currentUser, TRANSLATIONS[currentLang] || TRANSLATIONS.de);
    });
  }

  document.getElementById("btn-save-statements").addEventListener("click", () => {
    if (!currentUserId) return;
    for (let i = 0; i < 3; i++) {
      localDraftStatements[inputLang][i] = document.getElementById(`input-stmt-${i}`).value;
    }

    ["de", "en", "krj"].forEach(l => {
      if (l !== inputLang) {
        for (let i = 0; i < 3; i++) {
          if (!localDraftStatements[l][i] || localDraftStatements[l][i].trim() === "") {
            localDraftStatements[l][i] = localDraftStatements[inputLang][i];
          }
        }
      }
    });

    sendAction("save_statements", {
      participantId: currentUserId,
      statements: localDraftStatements,
      lieIndex: localLieIndex
    });

    playSound("correct");
    const t = TRANSLATIONS[currentLang] || TRANSLATIONS.de;
    alert(t.savedSuccess);
  });

  const modModal = document.getElementById("mod-modal");
  document.getElementById("btn-open-moderator").addEventListener("click", () => {
    modModal.classList.add("open");
  });
  document.getElementById("mod-modal-close").addEventListener("click", () => {
    modModal.classList.remove("open");
  });

  document.getElementById("btn-mod-login").addEventListener("click", () => {
    const pin = document.getElementById("mod-pin-input").value;
    if (isLocalMode) {
      sessionStorage.setItem("wol_mod_pin", pin);
      sendAction("auth_moderator", { pin });
    } else {
      if (pin === "1234") {
        isModerator = true;
        sessionStorage.setItem("wol_mod_pin", "1234");
        document.getElementById("mod-auth-screen").style.display = "none";
        document.getElementById("mod-dashboard").style.display = "block";
        renderModeratorCockpit();
      } else {
        document.getElementById("mod-pin-error").style.display = "block";
      }
    }
  });

  document.getElementById("btn-mod-start-round").addEventListener("click", () => {
    const sel = document.getElementById("mod-player-select");
    sendAction("start_round", { participantId: sel.value });
    playSound("click");
  });

  document.getElementById("btn-mod-reveal").addEventListener("click", () => {
    sendAction("reveal_round");
    playSound("correct");
  });

  document.getElementById("btn-mod-next-round").addEventListener("click", () => {
    sendAction("next_round");
    playSound("click");
  });

  document.getElementById("btn-mod-reset-scores").addEventListener("click", () => {
    if (confirm("Möchtest du wirklich alle Punktestände auf 0 zurücksetzen?")) {
      sendAction("reset_scores");
    }
  });

  // Fetch LAN IP immediately
  if (isLocalMode) {
    fetch("/api/info")
      .then(res => res.json())
      .then(info => {
        if (info && info.url) {
          lanServerUrl = info.url;
          if (activeQrTarget === "wifi") setupQRCode(lanServerUrl);
        }
      })
      .catch(e => console.log("LAN fetch info:", e));
  }

  // QR Mode toggle buttons
  const btnWifi = document.getElementById("btn-qr-wifi");
  const btnGithub = document.getElementById("btn-qr-github");
  if (btnWifi && btnGithub) {
    btnWifi.addEventListener("click", () => {
      activeQrTarget = "wifi";
      btnWifi.style.background = "var(--primary)";
      btnWifi.style.color = "#fff";
      btnGithub.style.background = "#eaddd3";
      btnGithub.style.color = "#4b3d32";
      document.getElementById("qr-desc-text").textContent = "Gäste scannen diesen Barcode (im selben WLAN / Hotspot):";
      setupQRCode(lanServerUrl || "http://192.168.178.25:8000");
    });
    btnGithub.addEventListener("click", () => {
      activeQrTarget = "github";
      btnGithub.style.background = "var(--primary)";
      btnGithub.style.color = "#fff";
      btnWifi.style.background = "#eaddd3";
      btnWifi.style.color = "#4b3d32";
      document.getElementById("qr-desc-text").textContent = "Gäste scannen diesen Barcode (über das Internet / GitHub):";
      setupQRCode(GITHUB_URL);
    });
  }

  initNetworking();
});

