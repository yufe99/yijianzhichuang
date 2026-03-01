from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List
import uuid

from app.models.schemas import TaskCreate, TaskResponse
from app.models.database import VideoTask
from app.services.task_service import TaskService

router = APIRouter()
task_service = TaskService()


@router.post("", response_model=TaskResponse)
async def create_task(task_data: TaskCreate, background_tasks: BackgroundTasks):
    task = await task_service.create_task(
        input_mode=task_data.input_mode,
        input_content=task_data.input_content,
        video_mode=task_data.video_mode,
    )
    
    background_tasks.add_task(task_service.process_task, task.id)
    
    return TaskResponse(
        id=str(task.id),
        input_mode=task.input_type,
        input_content=task.input_content,
        video_mode=task.video_mode,
        status=task.status,
        current_stage=task.current_stage,
        progress=task.progress,
        output_url=task.output_url,
        thumbnail=task.thumbnail,
        duration=task.duration,
        created_at=task.created_at,
        updated_at=task.updated_at,
    )


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(task_id: str):
    task = await task_service.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    return TaskResponse(
        id=str(task.id),
        input_mode=task.input_type,
        input_content=task.input_content,
        video_mode=task.video_mode,
        status=task.status,
        current_stage=task.current_stage,
        progress=task.progress,
        output_url=task.output_url,
        thumbnail=task.thumbnail,
        duration=task.duration,
        created_at=task.created_at,
        updated_at=task.updated_at,
    )


@router.delete("/{task_id}")
async def cancel_task(task_id: str):
    success = await task_service.cancel_task(task_id)
    if not success:
        raise HTTPException(status_code=404, detail="任务不存在或无法取消")
    return {"message": "任务已取消"}


@router.get("", response_model=List[TaskResponse])
async def list_tasks(limit: int = 10, offset: int = 0):
    tasks = await task_service.list_tasks(limit, offset)
    return [
        TaskResponse(
            id=str(t.id),
            input_mode=t.input_type,
            input_content=t.input_content,
            video_mode=t.video_mode,
            status=t.status,
            current_stage=t.current_stage,
            progress=t.progress,
            output_url=t.output_url,
            thumbnail=t.thumbnail,
            duration=t.duration,
            created_at=t.created_at,
            updated_at=t.updated_at,
        )
        for t in tasks
    ]
