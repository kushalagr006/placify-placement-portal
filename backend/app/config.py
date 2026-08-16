from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables or .env file."""

    PROJECT_NAME: str = "College Placement & Internship Portal Backend"
    VERSION: str = "1.0.0"

    # Database connection string (MySQL)
    DATABASE_URL: str = "mysql+pymysql://root:password@localhost:3306/placement_db"

    # JWT Authentication settings
    SECRET_KEY: str = "your-super-secret-jwt-key-change-this-in-production-123456789"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 Hours

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )


settings = Settings()
