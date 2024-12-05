from homeassistant.components.sensor import SensorEntity
from homeassistant.helpers.update_coordinator import CoordinatorEntity
from homeassistant.helpers.device_registry import DeviceInfo
from .const import DOMAIN
# logger
import logging
_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(hass, entry, async_add_entities):
    """Set up the Greenhouse connection status sensor platform."""
    _LOGGER.warning("Setting up the Greenhouse connection status sensor platform")
    coordinator = hass.data[DOMAIN][entry.entry_id]["coordinator"]
    async_add_entities([GreenhouseSensor(coordinator)])

class GreenhouseSensor(CoordinatorEntity, SensorEntity):
    """Representation of a Greenhouse connection status sensor."""

    def __init__(self, coordinator):
        """Initialize the connection status sensor."""
        super().__init__(coordinator)
        self.coordinator = coordinator
        self._attr_name = f"{coordinator.device_name}"
        self._attr_unique_id = f"{coordinator.ip_address}"
        self._attr_device_class = "connectivity"
        _LOGGER.warning(f"GreenhouseSensor: {self.coordinator.device_name} - {self.coordinator.ip_address}")
        

    @property
    def state(self):
        """Return the state of the connection status sensor."""
        return "connected" if self.coordinator.data.get("connected", False) else "disconnected"
        
    @property
    def icon(self):
        """Return het icoon gebaseerd op de status."""
        return "mdi:link-variant" if self.state == "connected" else "mdi:link-variant-remove"
        
    @property
    def extra_state_attributes(self):
        """Add additional attributes to the sensor."""
        return {
            "card-name": self.coordinator.data.get("card-name", ""),
            "sensors": [
                i for i in self.coordinator.data.get("sensors", {})
            ]
        }


    @property
    def device_info(self) -> DeviceInfo:
        """Return device information for this entity."""
        return DeviceInfo(
            identifiers={(DOMAIN, self.coordinator.ip_address)},
            name=self.coordinator.device_name,
            manufacturer="Greenhouse",
            model="Sensor",
            configuration_url=f"http://{self.coordinator.ip_address}",
        )
