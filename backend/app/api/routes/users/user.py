from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_user_service, get_auth_service
from app.application.services.user_service import UserService
from app.application.services.auth_service import AuthService
from app.api.middleware.auth import get_current_user
from app.api.routes.users.schemas import (
    PaginatedResponse,
    PaginationParams, 
    UserResponse, 
    CreateUserRequest,
    UserProfileResponse
)
from app.domain.entities.auth import AuthUser

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


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_request: CreateUserRequest,
    user_service: UserService = Depends(get_user_service),
    auth_service: AuthService = Depends(get_auth_service),
):
    """Create a new user with authentication"""
    try:
        # Create authenticated user first
        _ = await auth_service.create_user(
            email=user_request.email,
            password=user_request.password
        )
        
        # Create regular user entity
        from app.domain.entities.user import User
        
        user = User(
            name=user_request.name,
            email=user_request.email
        )
        
        # Create user in the regular users collection
        created_user = await user_service.create_user(user)
        
        return UserResponse(
            id=created_user.id,
            name=created_user.name,
            email=created_user.email,
            created_at=created_user.created_at
        )
    
    except ValueError as e:
        if "already exists" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this email already exists"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user: {str(e)}"
        )


@router.get("/me", response_model=UserProfileResponse)
async def get_current_user_profile(
    current_user: AuthUser = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service),
):
    """Get current user's profile information"""
    try:
        # Get user profile from users collection
        user_profile = await user_service.get_user_by_email(current_user.email)
        
        if not user_profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found"
            )
        
        # Create user response
        user_response = UserResponse(
            id=user_profile.id,
            name=user_profile.name,
            email=user_profile.email,
            created_at=user_profile.created_at
        )
        
        return UserProfileResponse(
            user=user_response
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user profile: {str(e)}"
        )
