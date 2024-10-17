import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.data_entry_flow import FlowResult
from homeassistant.helpers import config_validation as cv
from homeassistant.components.zeroconf import ZeroconfServiceInfo
from .const import DOMAIN
import logging

STEP_USER_DATA_SCHEMA = vol.Schema({
    vol.Required("ip_address"): str,
    vol.Required("name"): str,
})

_LOGGER = logging.getLogger(__name__)


class GreenhouseConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Greenhouse."""

    VERSION = 1
    CONNECTION_CLASS = config_entries.CONN_CLASS_LOCAL_POLL

    async def async_step_user(self, user_input=None):
        """Handle the initial step."""
        if user_input is not None:
            await self.async_set_unique_id(user_input["ip_address"])
            self._abort_if_unique_id_configured()
            return self.async_create_entry(title=user_input["name"], data=user_input)
        
        return self.async_show_form(step_id="user", data_schema=STEP_USER_DATA_SCHEMA)

    async def async_step_zeroconf(self, discovery_info: ZeroconfServiceInfo) -> FlowResult:
        """Handle a flow initiated by zeroconf discovery."""
        _LOGGER.debug("Starting Zeroconf flow with: %s", discovery_info)

        # Get the device's IP address and name from ZeroconfServiceInfo object attributes
        ip_address = discovery_info.host  # Use 'host' instead of ["host"]
        name = discovery_info.name.split('.')[0]

        await self.async_set_unique_id(ip_address)
        self._abort_if_unique_id_configured()

        return self.async_create_entry(title=name, data={"ip_address": ip_address, "name": name})

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        """Options flow for Greenhouse."""
        return GreenhouseOptionsFlow(config_entry)

class GreenhouseOptionsFlow(config_entries.OptionsFlow):
    """Handle options flow."""

    def __init__(self, config_entry):
        self.config_entry = config_entry

    async def async_step_init(self, user_input=None):
        """Manage the options."""
        return await self.async_step_user()

    async def async_step_user(self, user_input=None):
        """Handle user options."""
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        options_schema = vol.Schema({
            vol.Optional("name", default=self.config_entry.data["name"]): str,
        })

        return self.async_show_form(step_id="user", data_schema=options_schema)
