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
      this.content = true;
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
    this.appendChild(card);
    this._sensors = [...this._sensors, card];
  }
}

import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";


class CustomView extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      cards: { type: Array, attribute: false },
    };
  }
  setConfig(config) {
    this.config = config;
  }

  render() {
    let dynamicContentCard = this.shadowRoot.querySelector("dynamic-content-card");
    if (!dynamicContentCard) {

      dynamicContentCard = document.createElement("dynamic-content-card");
      dynamicContentCard.setConfig({ base_entity: "sensor.greenhouse_" });
      dynamicContentCard.className = "sensor-view";
      //style
      Object.assign(dynamicContentCard.style, {
        display: "flex",
        flexWrap: "wrap",
        width: "100%",
      });
      this.shadowRoot.appendChild(dynamicContentCard);
    }
    dynamicContentCard.hass = this.hass;


    return html`
      <div class="extra-cards">
        ${this.cards.map(
          (card) => html`
            <div class="card">${card}</div>
          `
        )}
      </div>
    `;
  }

  // styling
  static get styles() {
    return css`

      .sensor-view {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 10px;
      }

      .extra-cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 10px;
      }

      .card {
        padding: 10px;
        border: 1px solid rgba(0, 0, 0,
        0.1);
        border-radius: 5px;
        background-color: var(--card-background-color);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

  `

  }
}


customElements.define('dynamic-content-card', DynamicContentCard);
customElements.define('custom-view', CustomView);