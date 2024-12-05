import { ContentCardExample } from "./content-card-example.js";

class DynamicContentCard extends HTMLElement {
  setConfig(config) {
    if (!config.base_entity) throw new Error('base_entity is required in the config');
    this._config = config;
    this.innerHTML = '';
    this._sensors = [];
  }

  /**
   * @param {{ states: {}; }} hass
   */
  set hass(hass) {
    this._hass = hass;
    const baseEntity = this._config.base_entity;
    const sensors = Object.keys(hass.states).filter((key) => key.startsWith(baseEntity));
    if (!this.content) {
      this.content = document.createElement('div');
      Object.assign(this.content.style, {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        overflow: "hidden",
        width: "90%",
        gap: "10px",
        margin:"1rem 1rem 0 1rem",
      });
      this.appendChild(this.content);
      setInterval(() => { this._sensors.forEach((sensor) => { sensor.hass = this._hass; }); }, 100);
    }
    this.updateSensorList(sensors);
  }

  updateSensorList(sensors) {
    sensors.forEach((sensor) => {
      if (!this._sensors.find((element) => element.id === sensor.split(".").pop())) {
        this.addSensor(sensor);
      }
    });
  }

  removeSensor(sensor) {
    const card = this._sensors.find((element) => element.id === sensor.split(".").pop());
    if (card) {
      this.content.removeChild(card);
      this._sensors = this._sensors.filter((element) => element.id !== sensor.split(".").pop());
    }
  }

  addSensor(sensor) {
    const card = new ContentCardExample();
    card.setConfig({ entity: sensor });
    card.hass = this._hass;
    card.id = `${sensor.split(".").pop()}`;
    this.content.appendChild(card);
    this._sensors = [...this._sensors, card];
  }
}

customElements.define('dynamic-content-card', DynamicContentCard);