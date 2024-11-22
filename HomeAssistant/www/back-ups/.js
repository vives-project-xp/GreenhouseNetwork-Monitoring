import {ContentCardExample} from "./content-card-example.js"

class DynamicContentCard extends HTMLElement {
  setConfig(config) {
    if (!config.base_entity) {
      throw new Error('base_entity is required in the config');
    }

    this._config = config;

    // Clean up existing content
    this.innerHTML = '';
    this._sensors = []
  }

  set hass(hass) {
    this._hass = hass;
    const baseEntity = this._config.base_entity;
    const sensors = Object.keys(hass.states).filter((key) => key.startsWith(baseEntity));
    if(!this.content){
        // Clear existing content
        this.innerHTML = '';
        this.content = document.createElement('div');
        this.content.style.display = 'flex';
        this.content.style.flexDirection = 'column';
    
        sensors.forEach((sensor) => {
            const card = new ContentCardExample()
            card.setConfig({ entity: sensor });
            card.hass = hass; // Assign hass object to each child card
            card.id = `${sensor.split(".")[-1]}`;
            this.content.appendChild(card);
            this._sensors = [...this._sensors, card ]
        });
    
        this.appendChild(this.content);
    }
    
    sensors.forEach((sensor) => {
        const card = new ContentCardExample()
        card.setConfig({ entity: sensor });
        card.hass = hass; // Assign hass object to each child card
        card.id = `${sensor.split(".")[-1]}`;
        this.content.appendChild(card);
        this._sensors = [...this._sensors, card ]
    });
    
    this._sensors.forEach((sensor) => {
        sensor.hass = hass
    });


  }

  getCardSize() {
    return 5;
  }
}

customElements.define('dynamic-content-card', DynamicContentCard);