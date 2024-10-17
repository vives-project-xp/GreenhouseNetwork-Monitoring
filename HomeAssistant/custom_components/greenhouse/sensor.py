from homeassistant.components.sensor import SensorEntity
from homeassistant.helpers.update_coordinator import CoordinatorEntity
from homeassistant.helpers.device_registry import DeviceInfo
from .const import DOMAIN

async def async_setup_entry(hass, config_entry, async_add_entities):
    """Set up Greenhouse sensor."""
    coordinator = hass.data[DOMAIN][config_entry.entry_id]
    
    async_add_entities([GreenhouseSensor(coordinator, config_entry)])


class GreenhouseSensor(CoordinatorEntity, SensorEntity):
    """Representation of a Greenhouse connection status sensor."""

    def __init__(self, coordinator, config_entry):
        """Initialize the sensor."""
        super().__init__(coordinator)
        self.coordinator = coordinator
        self.config_entry = config_entry
        self._attr_name = f"{coordinator.device_name} Status"
        self._attr_unique_id = f"{coordinator.ip_address}_status"
        self._attr_device_class = "connectivity"
        self._attr_state = None  # Set the initial state as None

    @property
    def state(self):
        """Return the state of the sensor."""
        return "connected" if self.coordinator.data["connected"] else "disconnected"

    @property
    def device_info(self) -> DeviceInfo:
        """Return device information for this entity."""
        return DeviceInfo(
            identifiers={(DOMAIN, self.coordinator.ip_address)},
            name=self.coordinator.device_name,
            manufacturer="ESP Device",
            model="ESP8266/ESP32",
            configuration_url=f"http://{self.coordinator.ip_address}",
        )
