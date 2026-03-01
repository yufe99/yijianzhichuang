import uuid
from datetime import datetime
from typing import Optional, List

from app.models.database import VideoTask
from app.core.websocket import ws_manager


class TaskService:
    def __init__(self):
        self.tasks = {}
    
    async def create_task(
        self,
        input_mode: str,
        input_content: str,
        video_mode: str,
    ) -> VideoTask:
        task = VideoTask(
            id=uuid.uuid4(),
            input_type=input_mode,
            input_content=input_content,
            video_mode=video_mode,
            status="pending",
            current_stage="parsing",
            progress=0,
        )
        self.tasks[str(task.id)] = task
        return task
    
    async def get_task(self, task_id: str) -> Optional[VideoTask]:
        return self.tasks.get(task_id)
    
    async def update_task_progress(
        self,
        task_id: str,
        stage: str,
        progress: int,
        status: str = "processing",
    ):
        if task_id in self.tasks:
            task = self.tasks[task_id]
            task.current_stage = stage
            task.progress = progress
            task.status = status
            task.updated_at = datetime.utcnow()
            
            await ws_manager.send_progress(task_id, stage, progress)
    
    async def complete_task(
        self,
        task_id: str,
        output_url: str,
        thumbnail: Optional[str] = None,
        duration: Optional[int] = None,
    ):
        if task_id in self.tasks:
            task = self.tasks[task_id]
            task.status = "completed"
            task.current_stage = "complete"
            task.progress = 100
            task.output_url = output_url
            task.thumbnail = thumbnail
            task.duration = duration
            task.updated_at = datetime.utcnow()
            
            await ws_manager.send_complete(task_id, output_url, thumbnail, duration or 0)
    
    async def fail_task(self, task_id: str, error_message: str):
        if task_id in self.tasks:
            task = self.tasks[task_id]
            task.status = "failed"
            task.error_message = error_message
            task.updated_at = datetime.utcnow()
            
            await ws_manager.send_error(task_id, error_message)
    
    async def cancel_task(self, task_id: str) -> bool:
        if task_id in self.tasks:
            task = self.tasks[task_id]
            if task.status == "pending":
                task.status = "cancelled"
                return True
        return False
    
    async def list_tasks(self, limit: int = 10, offset: int = 0) -> List[VideoTask]:
        tasks = list(self.tasks.values())
        tasks.sort(key=lambda t: t.created_at, reverse=True)
        return tasks[offset:offset + limit]
    
    async def process_task(self, task_id: str):
        task = self.tasks.get(task_id)
        if not task:
            return
        
        try:
            if task.video_mode == "anchor":
                await self._process_anchor_task(task_id)
            else:
                await self._process_manga_task(task_id)
        except Exception as e:
            await self.fail_task(task_id, str(e))
    
    async def _process_anchor_task(self, task_id: str):
        stages = [
            ("parsing", 10),
            ("rewriting", 25),
            ("compliance_check", 35),
            ("voice", 50),
            ("digital_human", 75),
            ("packaging", 90),
            ("complete", 100),
        ]
        
        for stage, progress in stages:
            await self.update_task_progress(task_id, stage, progress)
            await self._simulate_delay()
        
        await self.complete_task(
            task_id,
            output_url="https://example.com/output/anchor_demo.mp4",
            thumbnail="https://example.com/thumbnails/anchor_demo.jpg",
            duration=120,
        )
    
    async def _process_manga_task(self, task_id: str):
        stages = [
            ("parsing", 8),
            ("rewriting", 16),
            ("compliance_check", 24),
            ("storyboard", 35),
            ("image_gen", 60),
            ("video_render", 80),
            ("packaging", 90),
            ("complete", 100),
        ]
        
        for stage, progress in stages:
            await self.update_task_progress(task_id, stage, progress)
            await self._simulate_delay()
        
        await self.complete_task(
            task_id,
            output_url="https://example.com/output/manga_demo.mp4",
            thumbnail="https://example.com/thumbnails/manga_demo.jpg",
            duration=180,
        )
    
    async def _simulate_delay(self):
        import asyncio
        await asyncio.sleep(2)


task_service = TaskService()
