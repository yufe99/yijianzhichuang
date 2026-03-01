from fastapi import APIRouter, HTTPException

from app.models.schemas import PublishRequest, SchedulePublishRequest

router = APIRouter()


@router.post("")
async def publish_video(request: PublishRequest):
    return {
        "message": "发布功能开发中",
        "task_id": request.task_id,
        "platforms": request.platforms,
    }


@router.post("/schedule")
async def schedule_publish(request: SchedulePublishRequest):
    return {
        "message": "定时发布功能开发中",
        "task_id": request.task_id,
        "publish_time": request.publish_time,
    }
