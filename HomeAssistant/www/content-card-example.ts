import {
  MultiColoredGauge,
  Humidity,
  Temperature,
  GaugeColors,
} from "./custom-gauges.js";

class ContentCardExample extends HTMLElement {
  public theme: any;
  public lastValues: {};
  public card_name: string;
  public sensors: any[];
  public defaultGauge: Gauge;
  public content: any;
  public config: any;

  constructor() {
    super();
    this.theme = null;
    this.lastValues = {}; // Initialize lastValues to store last gauge values per sensor
    this.card_name = "";
    this.sensors = [];
    this.defaultGauge = new Gauge();
  }

  set hass(hass) {
    const entityId = this.config.entity;
    this.theme = hass.themes.darkMode;

    const state = hass.states[entityId];
    if (state) {
      this.card_name = state.attributes["card-name"];
      const newSensors = state.attributes.sensors;
      this.sensors =
        this.sensors.length === 0
          ? newSensors
          : this.sensors.map((sensor, i) => ({
              ...newSensors[i],
              canvas: sensor.canvas,
            }));
    }

    // Only initialize card once
    if (!this.content) {
      this.innerHTML = `
            <ha-card header="${this.card_name}" style="text-align:center;">
                <div class="card-content"></div>
            </ha-card>
            `;

      const style = document.createElement("style");
      style.textContent = `
            canvas {
                margin: 0px 8px;
            }
            `;
      this.appendChild(style);

      this.content = this.querySelector(".card-content");
      this.content.width = 400;

      // Append canvas for each sensor
      this.sensors.forEach((element, index) => {
        const canvas =
          element["type"].toLowerCase() === "humidity"
            ? new Humidity()
            : new Temperature();
        canvas.theme = this.theme;
        this.content.appendChild(canvas);
        element["canvas"] = canvas;
      });

      // Delay animation to ensure canvases are available in the DOM
      setTimeout(() => {
        this.sensors.forEach((element) => {
          element["canvas"].theme = this.theme;
          element["canvas"].value = element["sensor_value"];
        });
      }, 100);
    }
  }
  setConfig(config) {
    if (!config.entity) throw new Error("You need to define an entity");
    this.config = config;
  }
  getCardSize() {
    return 1;
  }

  // The rules for sizing your card in the grid in sections view
  getLayoutOptions() {
    return {
      grid_rows: 3,
      grid_columns: 1,
      grid_min_rows: 3,
      grid_max_rows: 3,
    };
  }

  drawGauge(name, value, id, min = 0, max = 100, unit = "") {
    const canvas = this.querySelector(
      `#${name}-sensor-${id}`
    ) as HTMLCanvasElement;
    if (!canvas) {
      console.error(`Canvas with id #${name}-sensor-${id} not found`);
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get 2D context");
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background circle
    ctx.beginPath();
    ctx.arc(
      canvas.width / 2,
      canvas.height - 50,
      canvas.width / 4 + canvas.width / 8,
      Math.PI,
      2 * Math.PI
    );
    ctx.strokeStyle = "#e6e6e6";
    ctx.stroke();
    ctx.closePath();

    // Calculate gauge angle
    const clampedValue = Math.max(min, Math.min(value, max));
    const angle = (Math.PI * (clampedValue - min)) / (max - min);

    // Draw gauge arc
    ctx.beginPath();
    ctx.arc(
      canvas.width / 2,
      canvas.height - 50,
      canvas.width / 4 + canvas.width / 8,
      Math.PI,
      Math.PI + angle
    );
    ctx.lineWidth = canvas.width / 4;
    ctx.strokeStyle = "#f00";
    ctx.stroke();
    ctx.closePath();

    // Draw value text
    ctx.font = "1.75rem Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      Math.round(clampedValue * 100) / 100 + unit,
      canvas.width / 2,
      canvas.height - 50
    );
  }

  animateGauge(name, targetValue, id, min = 0, max = 100, unit = "") {
    const duration = 1000; // Animation duration in ms
    const startValue = this.lastValues[id] || 0; // Track last values per sensor
    const startTime = performance.now();

    // Ensure canvas exists before starting animation
    if (!this.querySelector(`#${name}-sensor-${id}`)) {
      console.error(
        `Canvas with id ${name}-sensor-${id} not found for animation`
      );
      return;
    }

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const value = startValue + (targetValue - startValue) * progress;
      this.drawGauge(name, value, id, min, max, unit);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Save last animated value for this sensor
        this.lastValues[id] = targetValue;
      }
    };

    requestAnimationFrame(animate);
  }
}

class Gauge {
  canvas(ele, ind) {
    const c = document.createElement("canvas") as HTMLCanvasElement;
    c.id = `${ele["name"]}-sensor-${ind}`;
    c.width = 200;
    c.height = 150;
    return c;
  }
}

customElements.define("content-card", ContentCardExample);

export { ContentCardExample };
