import logging
import voluptuous as vol  # Voeg voluptuous toe om het schema te definiëren
from homeassistant import config_entries
from homeassistant.core import callback
from .const import DOMAIN  # Zorg ervoor dat DOMAIN in const.py staat

_LOGGER = logging.getLogger(__name__)

class GreenhouseConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Configuratiestroom voor de Greenhouse integratie."""

    async def async_step_user(self, user_input=None):
        """Stap voor het invoeren van gebruikersinformatie."""
        errors = {}

        if user_input is not None:
            ip_address = user_input.get("ip_address")
            name = user_input.get("name")
            # Voeg validatie toe als dat nodig is
            return self.async_create_entry(title="Greenhouse", data={"ip_address": ip_address , "name" : name})

        # Schema voor het invoeren van een IP-adres
        data_schema = vol.Schema({
            vol.Required("ip_address", default="0.0.0.0"): str,
            vol.Required("name", default="Greenhouse Sensor"): str,
        })

        return self.async_show_form(
            step_id="user",
            data_schema=data_schema,
            errors=errors,
        )
