import asyncio

async def ping_device(ip_address):
    """Ping a device to check if it's online."""
    proc = await asyncio.create_subprocess_exec(
        "ping", "-c", "1", "-W", "1", ip_address,
        stdout=asyncio.subprocess.DEVNULL,
        stderr=asyncio.subprocess.DEVNULL
    )
    await proc.communicate()
    return proc.returncode == 0
