from homeassistant.components.sensor import SensorEntity
from homeassistant.helpers.update_coordinator import CoordinatorEntity
from homeassistant.helpers.device_registry import DeviceInfo
from .const import DOMAIN

async def async_setup_entry(hass, entry, async_add_entities):
    coordinator = hass.data[DOMAIN][entry.entry_id]["coordinator"]
    async_add_entities([GreenhouseConnectionStatusSensor(coordinator), GreenhouseValueSensor(coordinator)])

class GreenhouseConnectionStatusSensor(CoordinatorEntity, SensorEntity):
    """Representation of a Greenhouse connection status sensor."""

    def __init__(self, coordinator):
        """Initialize the connection status sensor."""
        super().__init__(coordinator)
        self.coordinator = coordinator
        self._attr_name = f"{coordinator.device_name} Connection Status"
        self._attr_unique_id = f"{coordinator.ip_address}_connection_status"
        self._attr_device_class = "connectivity"

    @property
    def state(self):
        """Return the state of the connection status sensor."""
        return "connected" if self.coordinator.data.get("connected", False) else "disconnected"

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

class GreenhouseValueSensor(CoordinatorEntity, SensorEntity):
    """Representation of a Greenhouse sensor value sensor."""

    def __init__(self, coordinator):
        """Initialize the sensor value sensor."""
        super().__init__(coordinator)
        self.coordinator = coordinator
        self._attr_name = f"{coordinator.device_name} Value"  # Naam van de sensor
        self._attr_unique_id = f"{coordinator.ip_address}_value"  # Unieke ID
        self._attr_device_class = "measurement"  # Of een andere relevante device class

    @property
    def state(self):
        """Return the state of the value sensor, which is the received value."""
        return self.coordinator.data.get("sensor_value", 0)  # Vervang "sensor_value" door de sleutel die je ontvangt

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
