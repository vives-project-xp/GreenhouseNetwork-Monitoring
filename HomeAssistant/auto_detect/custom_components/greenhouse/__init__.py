import asyncio
from datetime import timedelta
import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .const import DOMAIN, DEFAULT_POLL_INTERVAL
from .ping import ping_device

_LOGGER = logging.getLogger(__name__)

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Setup Greenhouse from a config entry."""
    coordinator = GreenhouseCoordinator(hass, entry.data)

    # Save the coordinator in the hass data dict
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = coordinator

    # Start the coordinator (start polling)
    await coordinator.async_config_entry_first_refresh()

    # Register the sensor platform
    hass.async_create_task(
        hass.config_entries.async_forward_entry_setup(entry, "sensor")
    )

    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    coordinator = hass.data[DOMAIN].pop(entry.entry_id)

    await hass.config_entries.async_forward_entry_unload(entry, "sensor")
    return True


class GreenhouseCoordinator(DataUpdateCoordinator):
    """Class to manage fetching data from the Greenhouse device."""

    def __init__(self, hass, config):
        """Initialize the coordinator."""
        self.ip_address = config["ip_address"]
        self.device_name = config["name"]
        
        super().__init__(
            hass,
            _LOGGER,
            name=f"Greenhouse device {self.device_name}",
            update_interval=timedelta(seconds=DEFAULT_POLL_INTERVAL),
        )

    async def _async_update_data(self):
        """Fetch data from the device."""
        try:
            is_online = await ping_device(self.ip_address)
            return {"connected": is_online}
        except Exception as err:
            raise UpdateFailed(f"Failed to ping device: {err}")
