from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', case_sensitive=False)

    bot_token: str = Field(alias='BOT_TOKEN')
    webhook_base_url: str = Field(alias='WEBHOOK_BASE_URL')
    webhook_path: str = Field(default='/telegram/webhook', alias='WEBHOOK_PATH')
    webhook_secret_token: str = Field(alias='WEBHOOK_SECRET_TOKEN')
    web_server_host: str = Field(default='0.0.0.0', alias='WEB_SERVER_HOST')
    web_server_port: int = Field(default=8080, alias='WEB_SERVER_PORT')

    backend_base_url: str = Field(alias='BACKEND_BASE_URL')
    backend_api_key: str = Field(alias='BACKEND_API_KEY')
    backend_hmac_secret: str = Field(alias='BACKEND_HMAC_SECRET')
    request_timeout_seconds: int = Field(default=10, alias='REQUEST_TIMEOUT_SECONDS')

    redis_url: str = Field(default='redis://localhost:6379/0', alias='REDIS_URL')
    bot_salt: str = Field(alias='BOT_SALT')
    ignore_forwarded_messages: bool = Field(default=True, alias='IGNORE_FORWARDED_MESSAGES')
    invite_link_expire_minutes: int = Field(default=15, alias='INVITE_LINK_EXPIRE_MINUTES')

    @property
    def webhook_url(self) -> str:
        return f"{self.webhook_base_url.rstrip('/')}{self.webhook_path}"


settings = Settings()
