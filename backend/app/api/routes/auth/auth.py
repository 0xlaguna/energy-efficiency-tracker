from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_auth_service
from app.application.services.auth_service import AuthService
from app.api.routes.auth.schemas import LoginRequest, LoginResponse, ErrorResponse

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post(
    "/login",
    response_model=LoginResponse,
    responses={
        401: {"model": ErrorResponse, "description": "Invalid credentials"},
        422: {"model": ErrorResponse, "description": "Validation error"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    }
)
async def login(
    login_request: LoginRequest,
    auth_service: AuthService = Depends(get_auth_service),
):
    """Authenticate user and return JWT token"""
    try:
        # Convert request to domain entity
        from app.domain.entities.auth import LoginRequest as DomainLoginRequest
        
        domain_request = DomainLoginRequest(
            email=login_request.email,
            password=login_request.password
        )
        
        # Authenticate user
        token = await auth_service.login(domain_request)
        
        return LoginResponse(
            access_token=token.access_token,
            token_type=token.token_type,
            expires_in=token.expires_in
        )
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication failed: {str(e)}"
        )
