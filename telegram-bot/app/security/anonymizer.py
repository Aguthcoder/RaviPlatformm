import hashlib


def hash_sender_id(sender_id: int, salt: str) -> str:
    value = f'{sender_id}:{salt}'.encode('utf-8')
    return hashlib.sha256(value).hexdigest()
