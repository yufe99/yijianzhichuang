from typing import Dict
import json


class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, list] = {}
    
    async def connect(self):
        pass
    
    async def disconnect(self):
        self.active_connections.clear()
    
    async def send_progress(self, task_id: str, stage: str, progress: int):
        if task_id in self.active_connections:
            message = json.dumps({
                "type": "progress",
                "stage": stage,
                "progress": progress
            })
            for connection in self.active_connections[task_id]:
                await connection.send_text(message)
    
    async def send_complete(self, task_id: str, output_url: str, thumbnail: str = None, duration: int = 0):
        if task_id in self.active_connections:
            message = json.dumps({
                "type": "complete",
                "outputUrl": output_url,
                "thumbnail": thumbnail,
                "duration": duration
            })
            for connection in self.active_connections[task_id]:
                await connection.send_text(message)
    
    async def send_error(self, task_id: str, error: str):
        if task_id in self.active_connections:
            message = json.dumps({
                "type": "error",
                "error": error
            })
            for connection in self.active_connections[task_id]:
                await connection.send_text(message)
    
    def add_connection(self, task_id: str, connection):
        if task_id not in self.active_connections:
            self.active_connections[task_id] = []
        self.active_connections[task_id].append(connection)
    
    def remove_connection(self, task_id: str, connection):
        if task_id in self.active_connections:
            self.active_connections[task_id].remove(connection)


ws_manager = WebSocketManager()
