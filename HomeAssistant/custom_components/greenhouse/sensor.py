import logging
import socket
from homeassistant.helpers.entity import Entity

DOMAIN = "greenhouse"
_LOGGER = logging.getLogger(__name__)

class GreenhouseSensor(Entity):
    """Een sensor die de status van de ESP32 Greenhouse weergeeft."""

    def __init__(self, host):
        self._state = None
        self._host = host

    @property
    def name(self):
        """Naam van de sensor."""
        return "Greenhouse Status"

    @property
    def state(self):
        """Huidige status van de sensor."""
        return self._state

    @property
    def unique_id(self):
        """Unieke ID voor de sensor."""
        return "greenhouse_status_sensor" + self._host

    @property
    def device_info(self):
        """Informatie over het apparaat."""
        return {
            "identifiers": {(DOMAIN, "greenhouse")},  # Unieke identifier voor het apparaat
            "name": "Greenhouse Sensor Device",
            "manufacturer": "ESP",
            "model": "ESP32",
        }

    async def async_update(self):
        """Update de status van de ESP32."""
        _LOGGER.info("Greenhouse sensorstatus updaten...")
        try:
            # Probeer een TCP-verbinding naar de ESP32 te maken op poort 80
            with socket.create_connection((self._host, 80), timeout=2):
                self._state = "verbonden"
                _LOGGER.info(f"Greenhouse is verbonden met IP {self._host}")
        except (socket.gaierror, socket.timeout, ConnectionRefusedError):
            self._state = "onbekend"
            _LOGGER.warning(f"Greenhouse apparaat niet bereikbaar op {self._host}")
