import {ContentCardExample} from "./content-card-example.js"

class DynamicContentCard extends HTMLElement {
  private _config: any;
  private _sensors: any;
  private content: any;

  setConfig(config: { base_entity: any; }) { // Set the configuration for the card
    if (!config.base_entity) throw new Error('base_entity is required in the config');
    this._config = config;
    this.innerHTML = '';
    this._sensors = [];
  }

  set hass(hass: { states: {}; }) {
    const baseEntity = this._config.base_entity; // Get the base_entity from the config
    const sensors = Object.keys(hass.states).filter((key) => key.startsWith(baseEntity)); // Filter out the sensors based on the base_entity
    if(!this.content){ // this acts as a flag to only run this block once
        // Clear existing content
        this.innerHTML = '';
        this.content = document.createElement('div');
        this.content.style.display = 'flex';
        this.content.style.flexDirection = 'column';
    
        sensors.forEach((sensor) => {
            const card = new ContentCardExample()
            card.setConfig({ entity: sensor });
            card.hass = hass; // Assign hass object to each child card
            card.id = `${sensor.split(".").pop()}`;
            this.content.appendChild(card);
            this._sensors = [...this._sensors, card ]
        });
    
        this.appendChild(this.content);
    }
    
    sensors.forEach((sensor)=>{
        if(!this._sensors.filter(s=>s.id === `${sensor.split(".").pop()}`)){
            const card = new ContentCardExample()
            card.setConfig({ entity: sensor });
            card.hass = hass; // Assign hass object to each child card
            card.id = `${sensor.split(".").pop()}`;
            this.content.appendChild(card);
            this._sensors = [...this._sensors, card ]
        }
        
    })
    
    this._sensors.forEach((sensor: { hass: { states: {}; }; }) => { sensor.hass = hass });
  }

  getCardSize() {
    return 5;
  }
}

customElements.define('dynamic-content-card', DynamicContentCard);