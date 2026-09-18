# /// script
# dependencies = [
#   "fastapi",
#   "uvicorn",
#   "websockets",
# ]
# ///
import os
import json
import socket
import asyncio
from typing import Dict, Set, Any
from pathlib import Path
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR
DATA_FILE = BASE_DIR / "spiel_daten.json"
MODERATOR_PIN = "1234"

app = FastAPI(title="Wahrheit oder Lüge")

DEFAULT_PARTICIPANTS = [
    {"id": "p_1", "name": "Princess", "sticker": ""},
    {"id": "p_2", "name": "Chris P", "sticker": "assets/stickers/Christian Pohl.png"},
    {"id": "p_3", "name": "Cyro", "sticker": "assets/stickers/Cyro.png"},
    {"id": "p_4", "name": "Cobie", "sticker": "assets/stickers/Cobie.png"},
    {"id": "p_5", "name": "Mercy", "sticker": "assets/stickers/Mercy.png"},
    {"id": "p_6", "name": "Neil", "sticker": "assets/stickers/Neil.png"},
    {"id": "p_7", "name": "Nick", "sticker": ""},
    {"id": "p_8", "name": "Delia", "sticker": ""},
    {"id": "p_9", "name": "Avelino", "sticker": "assets/stickers/Avelino Alcantara.png"},
    {"id": "p_10", "name": "Jessica", "sticker": ""},
    {"id": "p_11", "name": "Daeve", "sticker": ""},
    {"id": "p_12", "name": "Freundin", "sticker": ""},
    {"id": "p_13", "name": "Freund", "sticker": ""},
    {"id": "p_14", "name": "Chit", "sticker": "assets/stickers/Tante Chit.png"},
    {"id": "p_15", "name": "Rupert", "sticker": "assets/stickers/Ruppert K.png"},
    {"id": "p_16", "name": "Christian K.", "sticker": "assets/stickers/Christian König.png"},
    {"id": "p_17", "name": "Christine", "sticker": "assets/stickers/Christine.png"},
    {"id": "p_18", "name": "Girly 1", "sticker": "assets/stickers/Christines Tochter.png"},
    {"id": "p_19", "name": "Girly 2", "sticker": ""},
    {"id": "p_20", "name": "Clemens", "sticker": "assets/stickers/Clemens.png"},
    {"id": "p_21", "name": "Carmela", "sticker": "assets/stickers/Carmela.png"},
    {"id": "p_22", "name": "Patrick-w", "sticker": "assets/stickers/Patrick mit Malia.png"},
    {"id": "p_23", "name": "Leonie", "sticker": "assets/stickers/Leonie.png"},
    {"id": "p_24", "name": "Malia", "sticker": "assets/stickers/Patrick mit Malia.png"},
    {"id": "p_25", "name": "Emily", "sticker": "assets/stickers/Emily.png"},
    {"id": "p_26", "name": "Viktoria", "sticker": ""},
    {"id": "p_27", "name": "Christian", "sticker": "assets/stickers/Christian.png"},
]

def init_default_data():
    participants = []
    scores = {}
    for p in DEFAULT_PARTICIPANTS:
        participants.append({
            "id": p["id"],
            "name": p["name"],
            "sticker": p["sticker"],
            "statements": {
                "de": ["", "", ""],
                "en": ["", "", ""],
                "krj": ["", "", ""]
            },
            "lieIndex": 0,
            "hasSubmitted": False
        })
        scores[p["id"]] = 0

    return {
        "title": "Wahrheit oder Lüge",
        "moderatorPin": MODERATOR_PIN,
        "participants": participants,
        "currentRound": {
            "activeParticipantId": None,
            "status": "waiting",
            "votes": {}
        },
        "scores": scores,
        "history": []
    }

def load_data() -> dict:
    if DATA_FILE.exists():
        try:
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Fehler beim Laden von spiel_daten.json: {e}")
    data = init_default_data()
    save_data(data)
    return data

def save_data(data: dict):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

game_state = load_data()

class ConnectionManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.moderator_connections: Set[WebSocket] = set()
        self.client_participants: Dict[WebSocket, str] = {}

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)
        self.moderator_connections.discard(websocket)
        self.client_participants.pop(websocket, None)

    def set_moderator(self, websocket: WebSocket):
        self.moderator_connections.add(websocket)

    def set_participant(self, websocket: WebSocket, participant_id: str):
        self.client_participants[websocket] = participant_id

    async def broadcast_state(self):
        full_state = game_state
        public_state = json.loads(json.dumps(game_state))

        round_status = public_state.get("currentRound", {}).get("status")
        if round_status != "revealed":
            for p in public_state.get("participants", []):
                p["lieIndex"] = None

        public_msg = json.dumps({"type": "state_update", "data": public_state, "isModerator": False})
        mod_msg = json.dumps({"type": "state_update", "data": full_state, "isModerator": True})

        tasks = []
        for ws in list(self.active_connections):
            try:
                if ws in self.moderator_connections:
                    tasks.append(ws.send_text(mod_msg))
                else:
                    tasks.append(ws.send_text(public_msg))
            except Exception:
                pass
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

manager = ConnectionManager()

def get_lan_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 1))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

@app.get("/api/info")
def get_info():
    ip = get_lan_ip()
    port = 8000
    url = f"http://{ip}:{port}"
    return {
        "ip": ip,
        "port": port,
        "url": url,
        "participantsCount": len(game_state.get("participants", []))
    }

@app.get("/api/export")
def export_json():
    if DATA_FILE.exists():
        return FileResponse(DATA_FILE, media_type="application/json", filename="spiel_daten.json")
    return JSONResponse(game_state)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    public_state = json.loads(json.dumps(game_state))
    if public_state.get("currentRound", {}).get("status") != "revealed":
        for p in public_state.get("participants", []):
            p["lieIndex"] = None
    await websocket.send_text(json.dumps({
        "type": "state_update",
        "data": public_state,
        "isModerator": False,
        "serverInfo": {
            "url": f"http://{get_lan_ip()}:8000"
        }
    }))

    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            action = payload.get("action")

            if action == "auth_moderator":
                pin = payload.get("pin")
                if pin == game_state.get("moderatorPin", MODERATOR_PIN):
                    manager.set_moderator(websocket)
                    await websocket.send_text(json.dumps({
                        "type": "auth_success",
                        "isModerator": True
                    }))
                    await websocket.send_text(json.dumps({
                        "type": "state_update",
                        "data": game_state,
                        "isModerator": True
                    }))
                else:
                    await websocket.send_text(json.dumps({
                        "type": "auth_error",
                        "message": "Falscher Moderator-PIN!"
                    }))

            elif action == "register_player":
                participant_id = payload.get("participantId")
                manager.set_participant(websocket, participant_id)
                await manager.broadcast_state()

            elif action == "save_statements":
                p_id = payload.get("participantId")
                statements = payload.get("statements")
                lie_index = int(payload.get("lieIndex", 0))

                for p in game_state["participants"]:
                    if p["id"] == p_id:
                        p["statements"] = statements
                        p["lieIndex"] = lie_index
                        p["hasSubmitted"] = True
                        break
                save_data(game_state)
                await manager.broadcast_state()

            elif action == "start_round":
                if websocket in manager.moderator_connections:
                    active_id = payload.get("participantId")
                    game_state["currentRound"] = {
                        "activeParticipantId": active_id,
                        "status": "voting",
                        "votes": {}
                    }
                    save_data(game_state)
                    await manager.broadcast_state()

            elif action == "cast_vote":
                voter_id = payload.get("voterId")
                statement_index = int(payload.get("statementIndex"))
                curr_round = game_state["currentRound"]
                if curr_round.get("status") == "voting":
                    if voter_id != curr_round.get("activeParticipantId"):
                        curr_round["votes"][voter_id] = statement_index
                        save_data(game_state)
                        await manager.broadcast_state()

            elif action == "reveal_round":
                if websocket in manager.moderator_connections:
                    curr_round = game_state["currentRound"]
                    active_id = curr_round.get("activeParticipantId")
                    active_p = next((p for p in game_state["participants"] if p["id"] == active_id), None)

                    if active_p and curr_round.get("status") == "voting":
                        correct_lie_index = active_p.get("lieIndex", 0)
                        curr_round["status"] = "revealed"
                        curr_round["correctLieIndex"] = correct_lie_index

                        votes = curr_round.get("votes", {})
                        round_results = []
                        for v_id, choice in votes.items():
                            is_correct = (choice == correct_lie_index)
                            if is_correct:
                                game_state["scores"][v_id] = game_state["scores"].get(v_id, 0) + 100
                            round_results.append({
                                "voterId": v_id,
                                "choice": choice,
                                "isCorrect": is_correct
                            })

                        game_state["history"].append({
                            "participantId": active_id,
                            "participantName": active_p.get("name"),
                            "correctLieIndex": correct_lie_index,
                            "results": round_results
                        })

                        save_data(game_state)
                        await manager.broadcast_state()

            elif action == "next_round":
                if websocket in manager.moderator_connections:
                    game_state["currentRound"] = {
                        "activeParticipantId": None,
                        "status": "waiting",
                        "votes": {}
                    }
                    save_data(game_state)
                    await manager.broadcast_state()

            elif action == "reset_scores":
                if websocket in manager.moderator_connections:
                    for p in game_state["participants"]:
                        game_state["scores"][p["id"]] = 0
                    game_state["history"] = []
                    game_state["currentRound"] = {
                        "activeParticipantId": None,
                        "status": "waiting",
                        "votes": {}
                    }
                    save_data(game_state)
                    await manager.broadcast_state()

    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        manager.disconnect(websocket)

if (STATIC_DIR).exists():
    app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    lan_ip = get_lan_ip()
    port = 8000
    print("=" * 60)
    print(" WAHRHEIT ODER LÜGE - SPIELSERVER GESTARTET ")
    print(f" Lokale Adresse: http://localhost:{port}")
    print(f" WLAN-Adresse (fuer Gaeste / QR-Code): http://{lan_ip}:{port}")
    print(f" Moderator PIN: {MODERATOR_PIN}")
    print("=" * 60)
    uvicorn.run(app, host="0.0.0.0", port=port)

