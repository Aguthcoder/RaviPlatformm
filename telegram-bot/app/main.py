import asyncio
import logging

from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.webhook.aiohttp_server import SimpleRequestHandler, setup_application
from aiohttp import web
from redis.asyncio import Redis

from app.config import settings
from app.handlers.group_events import router as group_router
from app.services.backend_client import BackendClient


async def on_startup(bot: Bot) -> None:
    await bot.set_webhook(
        url=settings.webhook_url,
        secret_token=settings.webhook_secret_token,
        allowed_updates=['message', 'my_chat_member'],
        drop_pending_updates=True,
    )


async def on_shutdown(bot: Bot, redis: Redis, backend: BackendClient) -> None:
    await bot.delete_webhook(drop_pending_updates=False)
    await redis.aclose()
    await backend.close()
    await bot.session.close()


async def build_app() -> web.Application:
    bot = Bot(token=settings.bot_token, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    dispatcher = Dispatcher()
    redis = Redis.from_url(settings.redis_url, decode_responses=True)
    backend = BackendClient()

    dispatcher.include_router(group_router)
    dispatcher['redis'] = redis
    dispatcher['backend'] = backend

    dispatcher.startup.register(lambda: on_startup(bot))
    dispatcher.shutdown.register(lambda: on_shutdown(bot, redis, backend))

    app = web.Application()
    SimpleRequestHandler(dispatcher=dispatcher, bot=bot, secret_token=settings.webhook_secret_token).register(
        app,
        path=settings.webhook_path,
    )
    setup_application(app, dispatcher, bot=bot)
    return app


def main() -> None:
    logging.basicConfig(level=logging.INFO)
    app = asyncio.run(build_app())
    web.run_app(app, host=settings.web_server_host, port=settings.web_server_port)


if __name__ == '__main__':
    main()
