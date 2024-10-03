import logging
import socket
from datetime import timedelta
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.helpers.device_registry import async_get as async_get_device_registry
from homeassistant.components.zeroconf import async_get_instance
from .sensor import GreenhouseSensor

DOMAIN = "greenhouse"
_LOGGER = logging.getLogger(__name__)

async def async_setup_entry(hass, entry):
    """Setup een configuratie-entry voor de integratie."""
    ip_address = entry.data["ip_address"]

    # Registreer het apparaat in de device registry
    device_registry = async_get_device_registry(hass)
    device_registry.async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={(DOMAIN, ip_address)},  # Gebruik het IP-adres als unieke identifier
        manufacturer="ESP",
        model="ESP32",
        name="Greenhouse Sensor Device",
        connections={(DOMAIN, ip_address)},  # Verbind het apparaat met het IP-adres
    )

    # Voeg de sensor toe aan Home Assistant
    sensor = GreenhouseSensor(ip_address)

    async def update_sensor(_):
        # Werk de sensorstatus bij
        await sensor.async_update()
        hass.states.async_set("sensor.greenhouse_status", sensor.state)

    # Begin met onbekende status
    hass.states.async_set("sensor.greenhouse_status", "onbekend")

    # Regelmatige updates instellen
    async_track_time_interval(hass, update_sensor, timedelta(seconds=5))

    return True

async def async_discover_zeroconf(hass, context, data):
    """Handel Zeroconf ontdekking af."""
    _LOGGER.info(f"Greenhouse device gevonden via Zeroconf: {data}")

    # Voeg apparaat toe via configuratiestroom
    await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": "zeroconf"},
        data=data
    )

async def async_setup(hass, config):
    """Setup de Greenhouse integratie en luister naar Zeroconf ontdekkingen."""
    _LOGGER.info("Greenhouse integratie setup gestart...")

    # Registreer de Zeroconf discovery listener
    zeroconf = await async_get_instance(hass)
    await zeroconf.async_register_service("_greenhouse._tcp.local.", async_discover_zeroconf)

    return True
