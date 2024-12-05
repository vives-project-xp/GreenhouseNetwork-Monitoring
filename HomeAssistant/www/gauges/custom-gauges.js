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

    static get EC() { // electrical conductivity colors
        const colors = new GaugeColors();
        colors.addColor('rgba(0, 255, 0, 1)', 1);
        colors.addColor('rgba(255, 255, 0, 1)', 1);
        colors.addColor('rgba(255, 0, 0, 1)', 1);
        colors.normalize();
        return colors;
    }

    static get PH() { // pH colors
        const colors = new GaugeColors();
        colors.addColor('rgba(0, 255, 0, 1)', 1);
        colors.addColor('orange', 1);
        colors.addColor('blueviolet', 1);
        colors.normalize();
        return colors;
    }

    static get PA(){ // pressure colors
        const colors = new GaugeColors();
        colors.addColor('rgba(0, 255, 0, 1)', 1);
        colors.addColor('rgba(255, 255, 0, 1)', 1);
        colors.addColor('rgba(255, 0, 0, 1)', 1);
        colors.normalize();
        return colors;
    }

    static get CO2(){ // CO2 colors

        // color pallet that fits the CO2 gauge
        const colors = new GaugeColors();
        colors.addColor('rgba(0, 255, 0, 1)', 1);
        colors.addColor('rgba(255, 255, 0, 1)', 1);
        colors.addColor('rgba(255, 0, 0, 1)', 1);
        colors.normalize(); 
        return colors;
    }

    static get DEFAULT() { // default colors
        const colors = new GaugeColors();
        colors.addColor('rgba(0, 255, 0, 1)', 1);
        colors.addColor('rgba(255, 255, 0, 1)', 1);
        colors.addColor('rgba(255, 0, 0, 1)', 1);
        colors.normalize();
        return colors;
    }

    static get UV() { // UV colors
        const colors = new GaugeColors();
        colors.addColor('green', 3);
        colors.addColor('yellow', 3);
        colors.addColor('orange', 2);
        colors.addColor('red', 3);
        colors.addColor('purple', 1);
        colors.normalize();
        return colors;
    }
}
class NotConnected extends HTMLElement {
    // this is a component that will be displayed when the sensor is not connected
    constructor() {
        super();
        this.innerHTML = 'Not connected';
    }
}
class BaseGauge extends HTMLElement { // Base class for all gauges
    constructor() {
        super();
        this._theme = true;
        this.name = 'BaseGauge';
        const canvas = document.createElement('canvas');
        this.appendChild(canvas);
        this.ctx = canvas.getContext('2d');
        this.style.display = 'block';
        this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
        this.resizeObserver.observe(this);
        this._value = 0;
    }

    set min(min) {
        this._min = min!==undefined ? min : 0;
    }

    get min() {
        return this._min;
    }

    set max(max) {
        this._max = max!==undefined ? max : 100;
    }

    get max() {
        return this._max;
    }


    resizeCanvas() {
        const canvas = this.querySelector('canvas');
        canvas.width = this.width = 100;
        canvas.height = this.height = 100;
        this.draw();
    }

    set theme(theme){
        this._theme = theme;
    }

    get theme(){
        return this._theme;
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
            const smoothedProgress = Math.pow(progress, 2) * (3 - 2 * progress); // Smooth transition
            this.value = startValue + (endValue - startValue) * smoothedProgress;
            this.draw();
            if (progress < 1) requestAnimationFrame(step);
            else this.lastValue = this._value;
        };
        requestAnimationFrame(step);
    }

    connectedCallback() {
        this.draw();
        this.intervalId = setInterval(async () => this.animateGauge(), 2000);
    }

    disconnectedCallback() {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.resizeObserver.disconnect();
    }
}

class Humidity extends BaseGauge {

    constructor() {
        super();
        this._value = 0;
        this.min = 0;
        this.max = 100;
        this.lastValue = 0;
        this._lineWidth = 3;
        this.unit = '%';
        this.name = 'Humidity';
    }

    draw() {
        const normalizedValue = (this._value - this.min) / (this.max - this.min) * 100;

        // Draw the fill background that will be clipped into the fill shape
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(0, this.height, this.width, -this.height * normalizedValue / 100);
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
        this.ctx.font = `${this.width / 8}px Arial`;
        this.ctx.fillStyle = this.theme ? 'white' : 'black';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(Math.round(this._value * 100) / 100 + ' ' + this.unit, this.width / 2, this.height * 0.6);

    }
}

class MultiColoredGauge extends BaseGauge {
    constructor(colorWeights, min, max) {
        super();
        this.colorWeights = colorWeights;
        this.min = min;
        this.max = max;
        this._value = 0;
        this.lastValue = 0;
        this.unit = '';
        this.name = 'MultiColoredGauge';
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        const totalWeight = this.colorWeights.reduce((sum, cw) => sum + cw.weight, 0);
        let startAngle = Math.PI;

        this.colorWeights.forEach(({ color, weight }) => {
            const angleStep = (Math.PI * weight) / totalWeight;
            this.ctx.beginPath();
            this.ctx.arc(this.width / 2, this.height / 2, this.width / 3, startAngle, startAngle + angleStep, false);
            this.ctx.lineWidth = this.width / 10;
            this.ctx.strokeStyle = color;
            this.ctx.stroke();
            startAngle += angleStep;
        });

        // Draw the needle
        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2, this.height / 2);
        const needleAngle = Math.PI + (Math.PI * (this._value - this.min) / (this.max - this.min));
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
        this.ctx.font = `${this.width / 8}px Arial`;
        this.ctx.fillStyle = this.theme ? 'white' : 'black';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(Math.round(this._value * 100) / 100 + ' ' + this.unit, this.width / 2, this.height / 2 + this.width / 5);

    }
}

class Temperature extends BaseGauge {
    constructor() {
        super();
        this._value = 0;
        this.min = 0;
        this.max = 100;
        this.lastValue = 0;
        this._lineWidth = 3;
        this.unit = '°C';
        this.name = 'Temperature';
    }
    draw() {
        const normalizedValue = (this._value - this.min) / (this.max - this.min) * 100;
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw the fill background that will be clipped into the fill shape
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(0, this.height * 4 / 6, this.width, this.height);
        this.ctx.rect(0, this.height * 4 / 6, this.width, -this.height * 4 / 6 * normalizedValue / 100);
        this.ctx.closePath();
        this.ctx.clip();

        // Draw the fill shape of the thermometer
        this.ctx.beginPath();
        this.thermometerShape();
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();

        // Draw the border of the thermometer
        this.ctx.beginPath();
        this.thermometerShape();
        // line of the bottom of the thermometer
        this.ctx.lineWidth = this._lineWidth;
        this.ctx.strokeStyle = 'rgba(255, 0, 0, 1)';
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.font = `${this.width / 10}px Arial`;
        this.ctx.fillStyle = this.theme ? 'white' : 'black';
        // text shadow
        this.ctx.shadowColor = 'black';
        this.ctx.shadowBlur = 10;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(Math.round(this._value * 100) / 100 + ' ' + this.unit, this.width / 2, this.height / 1.25);

    }

    thermometerShape() {
        this.ctx.arc(this.width / 2, this.height / 1.25, this.width / 6, 1.7 * Math.PI, Math.PI * 1.3, false); // Outer circle
        // top-circle of the thermometer
        this.ctx.arc(this.width / 2, this.height / 5, this.width / 6, 1.3 * Math.PI, Math.PI * 1.7, false); // Inner circle
        this.ctx.arc(this.width / 2, this.height / 1.25, this.width / 6, 1.7 * Math.PI, Math.PI * 1.3, false); // Outer circle again to close the path
    }
}

class Bolt extends BaseGauge {
    constructor() {
        super();
        this._value = 0;
        this.min = 0;
        this.max = 100;
        this.lastValue = 0;
        this._lineWidth = 3;
        this.unit = 'V';
        this.name = 'Bolt';
    }

    draw(){

        const normalizedValue = (this._value - this.min) / (this.max - this.min) * 100;

        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(0, this.height, this.width, -this.height * normalizedValue / 100);
        this.ctx.closePath();
        this.ctx.clip();
        
        this.ctx.beginPath();
        this.lightningShape();
        this.ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();

        this.ctx.beginPath();
        this.lightningShape();
        this.ctx.lineWidth = this._lineWidth;
        this.ctx.strokeStyle = 'rgba(255, 255, 0, 1)';
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.font = `${this.width / 9}px Arial`;
        this.ctx.fillStyle = this.theme ? 'white' : 'black';
        // text shadow
        this.ctx.shadowColor = 'black';
        this.ctx.shadowBlur = 10;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(Math.round(this._value * 100) / 100 + ' ' + this.unit, this.width / 2, this.height / 2);

    }

    lightningShape(){
        this.ctx.moveTo(this.width/5*4, 0+5);
        this.ctx.lineTo(0+5, this.height/10*5.5);
        this.ctx.lineTo(this.width/9*5, this.height/10*5.5);
        this.ctx.lineTo(this.width/5*2, this.height-10);
        this.ctx.lineTo(this.width-5, this.height/10*4);
        this.ctx.lineTo(this.width/5*3, this.height/10*4);
        this.ctx.lineTo(this.width/5*4, 0+5);
    }

}


customElements.define('multi-colored-gauge', MultiColoredGauge, { extends: 'canvas' });
customElements.define('humidity-gauge', Humidity, { extends: 'canvas' });
customElements.define('temperature-gauge', Temperature, { extends: 'canvas' });
customElements.define('bolt-gauge', Bolt, { extends: 'canvas' });

export { MultiColoredGauge, Humidity, Temperature, GaugeColors, NotConnected, Bolt };
