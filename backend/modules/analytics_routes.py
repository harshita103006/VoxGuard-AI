from fastapi import APIRouter

from core.analytics import (
    get_threat_analytics
)

router = APIRouter()


@router.get("/analytics")
def analytics():

    return get_threat_analytics()