import json
from typing import Any

import httpx

from app.config import settings
from app.security.signature import make_hmac_signature


class BackendClient:
    def __init__(self) -> None:
        self.client = httpx.AsyncClient(
            base_url=settings.backend_base_url,
            timeout=settings.request_timeout_seconds,
            headers={'x-api-key': settings.backend_api_key, 'content-type': 'application/json'},
        )

    async def close(self) -> None:
        await self.client.aclose()

    async def post(self, path: str, payload: dict[str, Any], idempotency_key: str | None = None) -> dict[str, Any]:
        raw = json.dumps(payload, separators=(',', ':'), ensure_ascii=False).encode('utf-8')
        headers = {'x-ravi-signature': make_hmac_signature(raw, settings.backend_hmac_secret)}
        if idempotency_key:
            headers['x-idempotency-key'] = idempotency_key

        response = await self.client.post(path, content=raw, headers=headers)
        response.raise_for_status()
        return response.json() if response.content else {'ok': True}
