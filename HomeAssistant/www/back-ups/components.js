class GaugeColors extends Array {
    addColor(color, weight) {
        this.push({ color, weight });
    }

    removeColor(color) {
        const index = this.findIndex(cw => cw.color === color);
        if (index !== -1) this.splice(index, 1);
    }

    normalize() {
        const totalWeight = this.reduce((sum, cw) => sum + cw.weight, 0);
        this.forEach(cw => cw.weight /= totalWeight);
    }
}

class BaseGauge extends HTMLCanvasElement { // Base class for all gauges
    constructor() {
        super();
    }

    set value(value) {
        this._value = Math.min(Math.max(value, this.min), this.max);
    }

    get value() {
        return this._value;
    }

    draw() {
        throw new Error('draw method must be implemented');
    }

    animateGauge() {
        const animationDuration = 1000;
        const start = performance.now();
        const startValue = this.lastValue;
        const endValue = this.value;
        const step = (timestamp) => {
            const progress = Math.min((timestamp - start) / animationDuration, 1);
            this.value = startValue + (endValue - startValue) * progress;
            this.draw();
            if (progress < 1) requestAnimationFrame(step);
            else this.lastValue = this._value;
        };
        requestAnimationFrame(step);
    }

    connectedCallback() {
        if (!this.intervalId) {
            this.draw();
            this.intervalId = setInterval(async () => this.animateGauge(), 2000);
        }
    }

    disconnectedCallback() {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }
}

class Humidity extends BaseGauge {

    constructor() {
        super();
        this.ctx = this.getContext('2d');
        this.width = this.height = 200;
        this._value = 0;
        this.min = 0;
        this.max = 100;
        this.lastValue = 0;
        this._lineWidth = 3;

    }

    draw() {

        // Draw the fill background that will be clipped into the fill shape
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(0, this.height, this.width, -this.height * this._value / 100);
        this.ctx.closePath();
        this.ctx.clip();


        // Draw the fill shape
        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2, 0);
        this.ctx.bezierCurveTo(0, this.height / 2, 0, this.height, this.width / 2, this.height);
        this.ctx.bezierCurveTo(this.width, this.height, this.width, this.height / 2, this.width / 2, 0);
        // light blue
        this.ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();


        // Draw the border
        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2, 0 + this._lineWidth / 2);
        this.ctx.bezierCurveTo(0, this.height / 2, 0, this.height, this.width / 2, this.height - this._lineWidth / 2);
        this.ctx.bezierCurveTo(this.width, this.height - this._lineWidth / 2, this.width, this.height / 2, this.width / 2, 0);
        this.ctx.lineWidth = this._lineWidth;
        // dark blue
        this.ctx.strokeStyle = 'rgba(50, 30, 255, 1)';
        this.ctx.stroke();
        this.ctx.closePath();

        // Draw the value
        this.ctx.font = `${this.width / 10}px Arial`;
        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(Math.round(this._value * 100) / 100 + "%", this.width / 2, this.height * 0.6);


    }

}

class MultiColoredGauge extends BaseGauge {
    constructor(colorWeights, min, max) {
        super();
        this.colorWeights = colorWeights;
        this.ctx = this.getContext('2d');
        this.width = this.height = 200;
        this.min = min;
        this.max = max;
        this._value = 0;
        this.lastValue = 0;
        this.lastValue = 0;
        this.lastValue = 0;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        const totalWeight = this.colorWeights.reduce((sum, cw) => sum + cw.weight, 0);
        let startAngle = Math.PI;

        this.colorWeights.forEach(({ color, weight }) => {
            const angleStep = (Math.PI * weight) / totalWeight;
            this.ctx.beginPath();
            this.ctx.arc(this.width / 2, this.height / 2, this.width / 3, startAngle, startAngle + angleStep, false);
            this.ctx.lineWidth = 20;
            this.ctx.strokeStyle = color;
            this.ctx.stroke();
            startAngle += angleStep;
        });

        // Draw the needle
        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2, this.height / 2);
        const needleAngle = Math.PI + (Math.PI * this._value / this.max);
        this.ctx.lineTo(this.width / 2 + Math.cos(needleAngle) * this.width / 3, this.height / 2 + Math.sin(needleAngle) * this.width / 3);
        this.ctx.lineWidth = this.width / 50;
        this.ctx.strokeStyle = 'black';
        this.ctx.stroke();

        // Draw a center circle
        this.ctx.beginPath();
        this.ctx.arc(this.width / 2, this.height / 2, this.width / 25, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = 'black';
        this.ctx.fill();

        // Draw the value
        this.ctx.font = `${this.width / 10}px Arial`;
        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(Math.round(this._value * 100) / 100, this.width / 2, this.height / 2 + 50);
    }
}

class Temperature extends BaseGauge {
    constructor() {
        super();
        this.ctx = this.getContext('2d');
        this.width = this.height = 200;
        this._value = 0;
        this.min = 0;
        this.max = 100;
        this.lastValue = 0;
        this._lineWidth = 3;
    }
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw the fill background that will be clipped into the fill shape
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(0, this.height * 4 / 6, this.width, this.height);
        this.ctx.rect(0, this.height * 4 / 6, this.width, -this.height * 4 / 6 * this._value / 100);
        this.ctx.closePath();
        this.ctx.clip();

        // Draw the fill shape of the thermometer
        this.ctx.beginPath();
        this.themometorShape();
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();


        // Draw the border of the thermometer
        this.ctx.beginPath();
        this.themometorShape();
        // line of the bottom of the thermometer
        this.ctx.lineWidth = this._lineWidth;
        this.ctx.strokeStyle = 'rgba(255, 0, 0, 1)';
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.moveTo(this.width * 4 / 10, this.height * 4 / 6);
        this.ctx.lineTo(this.width * 6 / 10, this.height * 4 / 6);
        this.ctx.lineWidth = this._lineWidth;
        this.ctx.strokeStyle = 'rgba(255, 0, 0, 1)';
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.font = `${this.width / 15}px Arial`;
        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(Math.round(this._value * 100) / 100 + "°C", this.width / 2, this.height / 1.25);
    }

    themometorShape() {
        this.ctx.arc(this.width / 2, this.height / 1.25, this.width / 6, 1.7 * Math.PI, Math.PI * 1.3, false); // Outer circle
        // top-circle of the thermometer
        this.ctx.arc(this.width / 2, this.height / 5, this.width / 6, 1.3 * Math.PI, Math.PI * 1.7, false); // Inner circle
        this.ctx.arc(this.width / 2, this.height / 1.25, this.width / 6, 1.7 * Math.PI, Math.PI * 1.3, false); // Outer circle again to close the path
    }
}


customElements.define('multi-colored-gauge', MultiColoredGauge, { extends: 'canvas' });
customElements.define('humidity-gauge', Humidity, { extends: 'canvas' });
customElements.define('temperature-gauge', Temperature, { extends: 'canvas' });

document.addEventListener('DOMContentLoaded', () => {
    // slider
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 100;
    slider.value = 50;
    document.body.appendChild(slider);

    // humidity gauge
    const hum = new Humidity();
    document.body.appendChild(hum);

    // temperature gauge
    const temp = new Temperature();
    document.body.appendChild(temp);

    // multi-colored gauge
    const gaugeColors = new GaugeColors();
    gaugeColors.addColor('red', 1);
    gaugeColors.addColor('orange', 1);
    gaugeColors.addColor('yellow', 1);
    gaugeColors.addColor('green', 1);
    gaugeColors.addColor('blue', 1);
    gaugeColors.normalize();
    let c = document.createElement('canvas')
    c.classList.add('multi-colored-gauge');
    const multiColoredGauge = new MultiColoredGauge(gaugeColors, 0, 100);
    document.body.appendChild(multiColoredGauge);

    setInterval(() => {
        hum.value = slider.value;
        temp.value = slider.value;
        multiColoredGauge.value = slider.value;

    }, 10);

});
