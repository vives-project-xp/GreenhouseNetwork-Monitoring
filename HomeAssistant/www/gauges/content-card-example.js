import {
  MultiColoredGauge,
  Humidity,
  Temperature,
  GaugeColors,
  NotConnected,
  Bolt,
  Light,
} from "./custom-gauges.js";

class ContentCardExample extends HTMLElement {
  constructor() {
    super();
    this.theme = null;
    this.lastValues = {}; // Initialize lastValues to store last gauge values per sensor
    this.card_name = "";
    this.sensors = [];
  }

  canvasElement(type){
    switch(type.toLowerCase()){
      case "humidity":
        return new Humidity();
      case "temperature":
        return new Temperature();
      case "multi-colored-gauge":
        return new MultiColoredGauge();
      case "gauge-colors":
        return new GaugeColors();
      case "not-connected":
        return new NotConnected();
      case "light":
        return new Light();
      case "ec":
        return new Bolt();
      case "ph":
        return new MultiColoredGauge(GaugeColors.PH);
      case "pressure":
        return new MultiColoredGauge(GaugeColors.PA);
      case "co2":
        return new MultiColoredGauge(GaugeColors.CO2);
      case "uv":
        return new MultiColoredGauge(GaugeColors.UV);
      default:
        return new MultiColoredGauge(GaugeColors.DEFAULT);
    }
  }

  /**
   * @param {{ states: {}; }} hass
   * @returns {void}
   */
  set hass(hass) {
    const entityId = this.config.entity;
    this.theme = hass.themes.darkMode;


    const state = hass.states[entityId];
    if (state) {
      this.card_name = `${state.attributes["card-name"] || entityId.split(".").pop()} is ${state.state}`;
      const newSensors = state.attributes.sensors || [];
      this.sensors =
        this.sensors.length === 0
          ? newSensors
          : this.sensors.map((sensor, i) => ({
              ...newSensors[i],
              canvas: sensor.canvas,
            }));
      this.updateCardContent();
    }

    // Only initialize card once
    if (!this.content) {
      this.innerHTML = `
        <ha-card header="${this.card_name}" style="text-align:center;">
          <div class="card-content"></div>
        </ha-card>
      `;

      Object.assign(this.style, {
        margin: "1rem",

      });

      this.content = this.querySelector(".card-content");
      Object.assign(this.content.style, {
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        padding: "10px",
        boxSizing: "border-box",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
      });
    

      // Append canvas for each sensor
      this.sensors.forEach((element) => {
        const canvasContainer = document.createElement("div");
        Object.assign(canvasContainer.style, {
          display: "flex",
          width: "150px",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          padding: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
          backgroundColor: this.theme ? "#333" : "#fff",
          color: this.theme ? "#fff" : "#333",
          margin: "10px",
          // boxSizing: "border-box",
        });
        const label = document.createElement("div");
        label.textContent = element["name"];
        // make the label text wrap if it's too long
        label.style.whiteSpace = "normal";
        label.style.textAlign = "center";
        label.style.width = "100px";
        const canvas = this.canvasElement(element["type"]);
        canvas.theme = this.theme;

        canvasContainer.appendChild(canvas);
        canvasContainer.appendChild(label);
        this.content.appendChild(canvasContainer);
        element["canvas"] = canvas;
      });

      // Delay animation to ensure canvases are available in the DOM
      setInterval(() => this.updateCanvasValues(), 100);
    }
  }

  updateCanvasValues() {
    this.sensors.forEach((element) => {
      const sensor = element["canvas"];
      if (sensor) {
        const sensorValue = element["sensor_value"];
        sensor.value = sensorValue;
        sensor.theme = this.theme;
        sensor.unit = element["unit"];
        sensor.min = element["min"];
        sensor.max = element["max"];
      }
    });
  }

  updateCardContent() {
    const cardHeader = this.querySelector("ha-card");
    if (cardHeader) {
      cardHeader.setAttribute("header", this.card_name);
    }
  }

  setConfig(config) {
    if (!config.entity) throw new Error("You need to define an entity");
    this.config = config;
  }
}

customElements.define("content-card", ContentCardExample);

export { ContentCardExample };
