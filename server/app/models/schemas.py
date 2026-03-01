from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class TaskCreate(BaseModel):
    input_mode: str
    input_content: str
    video_mode: str


class TaskResponse(BaseModel):
    id: str
    input_mode: str
    input_content: str
    video_mode: str
    status: str
    current_stage: str
    progress: int
    output_url: Optional[str] = None
    thumbnail: Optional[str] = None
    duration: Optional[int] = None
    created_at: datetime
    updated_at: datetime


class ContentParse(BaseModel):
    content: str
    mode: str


class ContentRewrite(BaseModel):
    content: str
    style: dict


class ComplianceCheck(BaseModel):
    content: str


class ComplianceResult(BaseModel):
    is_compliant: bool
    filtered_content: Optional[str] = None
    issues: list[str] = []


class PlatformBind(BaseModel):
    platform: str
    auth_code: str


class PublishRequest(BaseModel):
    task_id: str
    platforms: list[str]


class SchedulePublishRequest(BaseModel):
    task_id: str
    publish_time: str
