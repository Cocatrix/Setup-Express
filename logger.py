import logging
from typing import List

logger = logging.getLogger(__name__)

def info(message: str) -> None:
    """
    Log `message` at INFO level.
    """
    logger.info(message)

def log_array(messages: List[str]) -> None:
    """
    Log each message from `messages` sequentially at DEBUG level.
    """
    for message in messages:
        logger.debug(message)
