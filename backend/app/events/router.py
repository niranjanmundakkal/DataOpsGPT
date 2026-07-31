from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.events.models import PipelineEvent
from app.auth.jwt import check_role
from app.auth.models import User

router = APIRouter(prefix="/events", tags=["Events"])


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                # If sending fails, we just ignore it or cleanup (handled on disconnect)
                pass


manager = ConnectionManager()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Maintain connection alive and receive optional messages
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@router.get("/")
def get_events(current_user: User = Depends(check_role(["ADMIN", "DATA_ENGINEER"]))):
    db: Session = SessionLocal()
    try:
        events = db.query(PipelineEvent).all()
        return events
    finally:
        db.close()
