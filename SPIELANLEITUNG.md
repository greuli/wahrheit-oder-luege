# Wahrheit oder Lüge (2 Wahrheiten, 1 Lüge) - Spielanleitung

Willkommen zum interaktiven Partyspiel für 27 Teilnehmer!

## 🚀 Schnellanleitung für den Spielleiter

1. **Spiel starten**:
   - Mache einen Doppelklick auf `start_spiel.bat`.
   - Ein Konsolenfenster öffnet sich und der Server startet automatisch.

2. **Web-App öffnen**:
   - Öffne auf deinem Tablet oder Laptop deinen Browser (Chrome, Edge, Safari oder Firefox).
   - Rufe die angezeigte Adresse auf (z. B. `http://localhost:8000` oder `http://192.168.178.25:8000`).

3. **Gäste einladen per Barcode/QR-Code**:
   - Klicke oben rechts auf **"🔐 Spielleiter"**.
   - Gib den PIN `1234` ein.
   - Dort findest du den großen **QR-Code**. Alle 27 Teilnehmer scannen diesen einfach mit der Kamera ihres Smartphones oder Tablets ab!

---

## 👥 Spielablauf

### Schritt 1: Teilnehmer auswählen & 3 Aussagen eintragen
- Jeder Teilnehmer tippt auf der Startseite auf **"👥 Teilnehmerliste"** und wählt seinen Namen aus (z. B. *Princess, Cobie, Mercy, Neil...*).
- Anschließend trägt jeder Teilnehmer 3 Aussagen über sich ein:
  - 2 Aussagen sind **wahr**.
  - 1 Aussage ist **gelogen**.
  - Mit einem Klick auf den Schalter wird die Lüge geheim markiert (❌).
  - Man kann die Aussagen wahlweise auf **Deutsch**, **Englisch** oder **Kinaray-a** eingeben.
  - Klicke auf **"💾 Aussagen speichern"**.

### Schritt 2: Die Spielrunden
- Der Moderator wählt im Spielleiter-Cockpit den Teilnehmer aus, der an der Reihe ist, und klickt auf **"▶️ Runde starten"**.
- Auf allen Smartphones erscheinen gleichzeitig die 3 Aussagen auf den edlen **Herbst-Karteikarten**.
- Der Teilnehmer liest seine 3 Aussagen laut vor.
- Jeder Gast kann oben die Sprache wechseln (🇩🇪 Deutsch, 🇬🇧 English, 🇵🇭 Kinaray-a).
- Alle anderen Teilnehmer tippen auf die Karteikarte, die sie für die **LÜGE** halten.

### Schritt 3: Auflösung & Punkte
- Der Moderator sieht live, wie viele Stimmen bereits eingegangen sind, und welche Karte die tatsächliche Lüge ist.
- Der Moderator klickt auf **"🎉 Jetzt auflösen!"**:
  - Auf allen Displays wird die Lüge mit einem roten Stempel aufgedeckt und die Wahrheiten grün markiert!
  - Wer richtig getippt hat, bekommt **+100 Punkte** mit feierlichem Fanfaren-Sound und Konfetti!
  - Die Live-Rangliste (Leaderboard) wird automatisch aktualisiert.

---

## 📁 Dateien im Ordner

- `start_spiel.bat` : 1-Klick Starter für Windows.
- `server.py` : Der schnelle WebSocket- & HTTP-Server mit automatischer IP-Erkennung.
- `spiel_daten.json` : Die zentrale JSON-Datenbank mit allen Teilnehmern, Aussagen und Punkteständen.
- `static/assets/card_bg.jpg` : Das von Ihnen bereitgestellte herbstliche Aquarell-Hintergrundbild für die Karteikarten.
- `static/assets/stickers/` : Die Profilbilder/Sticker der Teilnehmer.
