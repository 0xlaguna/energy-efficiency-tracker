from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_user_service
from app.application.services.user_service import UserService
from app.api.routes.users.schemas import PaginatedResponse, PaginationParams, UserResponse

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=PaginatedResponse)
async def get_users(
    pagination: PaginationParams = Depends(),
    user_service: UserService = Depends(get_user_service),
):
    """Get paginated users"""
    try:
        # Get users and total count
        users = await user_service.get_users_paginated(
            skip=pagination.skip,
            limit=pagination.limit
        )
        total = await user_service.get_users_count()
        
        user_responses = [
            UserResponse(
                id=user.id,
                name=user.name,
                email=user.email,
                created_at=user.created_at
            )
            for user in users
        ]
        
        # Calculate pagination info
        has_next = pagination.skip + pagination.limit < total
        has_prev = pagination.skip > 0
        
        return PaginatedResponse(
            items=user_responses,
            total=total,
            skip=pagination.skip,
            limit=pagination.limit,
            has_next=has_next,
            has_prev=has_prev
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch users: {str(e)}"
        )
