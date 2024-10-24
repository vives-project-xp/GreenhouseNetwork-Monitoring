import logging
from datetime import timedelta
from homeassistant.helpers import config_validation as cv
from homeassistant.const import EVENT_HOMEASSISTANT_STOP
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.components.webhook import async_register, async_unregister

from .const import DOMAIN, DEFAULT_POLL_INTERVAL
from .ping import ping_device
from aiohttp import web

_LOGGER = logging.getLogger(__name__)

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Greenhouse from a config entry."""
    coordinator = GreenhouseCoordinator(hass, entry.data)
    ip_address = entry.data["ip_address"]
    webhook_id = f"greenhouse_{ip_address.replace('.', '_')}"

    # Save the coordinator and webhook_id in the hass data dict
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = {
        "coordinator": coordinator,
        "webhook_id": webhook_id,
    }

    # Start the coordinator (start polling)
    await coordinator.async_config_entry_first_refresh()

    # Register the sensor platform
    await  hass.config_entries.async_forward_entry_setup(entry, "sensor")

    async def handle_webhook(hass, webhook_id, request):
        """Handle incoming webhook data."""
        try:
            data = await request.json()
            _LOGGER.info(f"Received webhook data: {data} from {webhook_id}")

            if "sensor_value" in data:
                sensor_value = data["sensor_value"]
                _LOGGER.info(f"Sensor value received: {sensor_value}")

                # Find the correct coordinator using the webhook_id
                for entry_data in hass.data[DOMAIN].values():
                    if entry_data["webhook_id"] == webhook_id:
                        coordinator = entry_data["coordinator"]
                        break
                else:
                    _LOGGER.error(f"No coordinator found for webhook_id: {webhook_id}")
                    return web.Response(status=404)

                coordinator.data["sensor_value"] = sensor_value  # Update sensor_value in data
                await coordinator.async_request_refresh()  # Force entity update
            return web.Response(text="Data is sended succesfully", status=200)

        except Exception as err:
            _LOGGER.error(f"Error handling webhook: {err}")
            return web.Response(status=500)

    # Register the webhook
    async_register(hass, DOMAIN, f"My Custom Webhook {ip_address}", webhook_id, handle_webhook)

    # Clean up the webhook when Home Assistant stops
    async def on_hass_stop(event):
        """Cleanup when Home Assistant is stopping."""
        _LOGGER.info(f"Home Assistant is stopping, deregistering webhook for {ip_address}.")
        async_unregister(webhook_id)

    hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STOP, on_hass_stop)

    _LOGGER.info(f"Webhook registered for Greenhouse device at {ip_address}. Webhook ID: {webhook_id}")

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    coordinator = hass.data[DOMAIN].pop(entry.entry_id)

    # Unregister webhook using the device's IP address
    ip_address = entry.data["ip_address"]
    webhook_id = f"greenhouse_{ip_address.replace('.', '_')}"
    hass.components.webhook.async_unregister(webhook_id)

    await hass.config_entries.async_forward_entry_unload(entry, "sensor")
    return True


class GreenhouseCoordinator(DataUpdateCoordinator):
    """Class to manage fetching data from the Greenhouse device."""

    def __init__(self, hass, config):
        """Initialize the coordinator."""
        self.device_name = config["name"]
        self.ip_address = config["ip_address"]
        super().__init__(
            hass,
            _LOGGER,
            name=f"Greenhouse device {self.device_name}",
            update_interval=timedelta(seconds=DEFAULT_POLL_INTERVAL),
        )
        
        
        
        # Zorg ervoor dat data correct wordt geïnitialiseerd
        self.data = {
            "connected": False,  # Begin met de connectiviteitstatus
            "sensor_value": 0  # Begin met een lege sensorwaarde
        }

    async def _async_update_data(self):
        """Fetch data from the device."""
        try:
            is_online = await ping_device(self.ip_address)
            self.data["connected"] = is_online  # Update de connectiviteitsstatus
            return self.data  # Zorg ervoor dat je de data retourneert
        except Exception as err:
            raise UpdateFailed(f"Failed to ping device: {self.data}")


