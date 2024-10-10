import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from .const import DOMAIN

STEP_USER_DATA_SCHEMA = vol.Schema({
    vol.Required("ip_address"): str,
    vol.Required("name"): str,
})

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
