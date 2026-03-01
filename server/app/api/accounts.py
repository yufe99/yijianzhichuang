from fastapi import APIRouter, HTTPException
from typing import List
import uuid

from app.models.schemas import PlatformBind, TaskResponse

router = APIRouter()


@router.get("")
async def get_accounts():
    return {"accounts": []}


@router.post("/bind")
async def bind_account(data: PlatformBind):
    return {"message": "账号绑定功能开发中", "platform": data.platform}


@router.delete("/{account_id}")
async def unbind_account(account_id: str):
    return {"message": "账号解绑成功"}
