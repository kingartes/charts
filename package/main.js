// -------------------------------------------------------------------------------------------------------------------------------------
// utils.js
function convertRgbToArray (rgb) {
    const rValue = parseInt(rgb.slice(1, 3), 16)
    const gValue = parseInt(rgb.slice(3, 5), 16)
    const bValue = parseInt(rgb.slice(5, 7), 16)
    return [rValue, gValue, bValue]
};
// -------------------------------------------------------------------------------------------------------------------------------------
// uicontrols.js
function renderControllButtons (dataManager) {
    const buttonsParams = dataManager.getChartsColors()
    const buttonsContainer = document.getElementById('controlButtons')
    for ( let name in buttonsParams ) {
        const checkboxElement = document.createElement('input')
        checkboxElement.type = 'checkbox'
        checkboxElement.checked = !dataManager.isIndexDisabled(name)
        const labelElement  = document.createElement('label')
        const textNode = document.createTextNode(name)
        const checkmark = document.createElement('div')
        checkmark.className = 'checkmark'
        labelElement.appendChild(checkboxElement)
        labelElement.appendChild(textNode)
        labelElement.appendChild(checkmark)
        labelElement.style.setProperty(`--color`, buttonsParams[name])
        buttonsContainer.appendChild(labelElement)
        checkboxElement.addEventListener('click', () => {
            dataManager.toogleChartDisable(name)
        })
    }
};
// --------------------------------------------------------------------------------------------------------------------------------------
// ThemeController.js
const ThemeController = (function(){
    const DAY_THEME = 'DAY_THEME'
const NIGHT_THEME = 'NIGHT_THEME'

const COLOR_SETTINGS = {
    [DAY_THEME]: {
        backgoundColor: '#ffffff',
        tooltip: {
            boxShadow: "1px 4px 0px rgb(190, 190, 190)",
            color: "black"
        },
        slider: {
            border: "rgba(0, 60, 100, 0.3)",
            background: "rgba(10, 60, 100, 0.1)"
        }
    },
    [NIGHT_THEME]: {
        backgoundColor: '#242f3e',
        tooltip: {
            boxShadow: "1px 4px 0px rgb(50, 50, 50)",
            color: "white"
        },
        slider: {
            border: "rgba(85, 135, 195, 0.5)",
            background: "rgba(0, 0, 0, 0.1)"
        }
    }
}

class ThemeController {
    constructor () {
        this.currentTheme = DAY_THEME
        this.colorSettings = COLOR_SETTINGS[this.currentTheme]
        document.getElementById('switchTheme').addEventListener('click', (e) => {
            e.preventDefault()
            this.swithTheme()
        })
    
    }

    swithTheme () {
        this.currentTheme = this.currentTheme === DAY_THEME ? NIGHT_THEME : DAY_THEME
        this.colorSettings = COLOR_SETTINGS[this.currentTheme]
        document.body.style.background = this.colorSettings.backgoundColor
        document.getElementById('controlButtons').style.setProperty(`--background-color`, this.colorSettings.backgoundColor)
        document.getElementById('app').style.setProperty(`--slider-background`, this.colorSettings.slider.background)
        document.getElementById('app').style.setProperty(`--slider-border`, this.colorSettings.slider.border)
        document.getElementById('app').style.setProperty(`--tooltip-color`, this.colorSettings.tooltip.color)
    }
}

return new ThemeController()
})();
// -------------------------------------------------------------------------------------------------------------------------------------
// TextTextures.js
const makeTextTextures = (function(){
    var textCtx = document.createElement("canvas").getContext("2d");
    
    function makeTextCanvas(text, width, height) {
        textCtx.canvas.width  = width;
        textCtx.canvas.height = height;
        textCtx.font = "20px monospace";
        textCtx.textAlign = "center";
        textCtx.textBaseline = "middle";
        textCtx.fillStyle = "white";
        textCtx.clearRect(0, 0, textCtx.canvas.width, textCtx.canvas.height);
        textCtx.fillText(text, width / 2, height / 2);
        return textCtx.canvas;
    }
    
    function makeTextTextures (gl) {
        const textTexturesMap = {}
        const textMap = {
            "a": "a", "b": "b", "c": "c", "d": "d", "e": "e", "f": "f", "g": "g", "h": "h",
            "i": "i", "j": "j", "k": "k", "l": "l", "m": "m", "n": "n", "o": "o", "p": "p",
            "q": "q", "r": "r", "s": "s", "t": "t", "u": "u", "v": "v", "w": "w", "x": "x",
            "y": "y", "z": "z", "1": "1", "2": "2", "3": "3", "4": "4", "5": "5", "6": "6",
            "7": "7", "8": "8", "9": "9", "0": "0"
        }
    
        for ( let key in textMap ) {
            var textCanvas = makeTextCanvas(textMap[key], 32, 32)
            var textWidth  = textCanvas.width
            var textHeight = textCanvas.height
            var textTex = gl.createTexture()
            gl.bindTexture(gl.TEXTURE_2D, textTex)
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
            textTexturesMap[key] = {
                texture: textTex,
                width: textWidth,
                height: textHeight,
                name
            }
        }
        return textTexturesMap
    }
    return makeTextTextures
})();
// ------------------------------------------------------------------------------------------------------------------------------------
// SliderController.js
const SliderController = (function(){
    class SliderController {
        constructor () {
            this.sliderDrag = false
            this.sliderScaleLeft = false
            this.x = 0
    
            this.slider = document.getElementById("slider")
            this.sliderContainer = document.getElementById("slider-container")
            this.sliderBackgroundLeft = document.getElementById("slider-background-left")
            this.sliderBackgroundRight = document.getElementById("slider-background-right")
            this.slider.addEventListener("mousedown", e => this.mouseDown(e) )
            document.addEventListener("mouseup", e => this.mouseUp(e) )
            this.sliderContainer.addEventListener("mousemove", e => this.mouseMove(e) )
            this.originalWidth = parseInt(this.sliderContainer.style.width)
        }
    
        getMaxRange () {
            return parseInt(this.sliderContainer.style.width) - parseInt(this.slider.style.width )  - 6
        }
    
        mouseDown (e) {
            this.x = e.x
            this.positionLeft = parseInt(this.slider.style.left)
            this.width = parseInt(this.slider.style.width)
            if (e.offsetX < 0) {
                this.sliderScaleLeft  = true
            }
            if (e.offsetX > this.width - 6) {
                this.sliderScaleRight = true
            } else  {
                this.sliderDrag = true
            }
        }
    
        mouseUp (e) {
            this.sliderDrag = false
            this.sliderScaleLeft = false
            this.sliderScaleRight = false
        }
    
        mouseMove (e) {
            let deltaX =  e.x - this.x
    
            if (this.sliderScaleLeft) {
                let newWidth = this.width - deltaX
                let newPos = this.positionLeft + deltaX
                this.slider.style.width = `${newWidth}px`
                if (newPos < 1) {
                    newPos = 1
                }
                if (newPos > this.getMaxRange()) {
                    newPos = this.getMaxRange()
                }
                this.slider.style.left = `${newPos}px`
                this.onScale && this.onScale(newWidth, 1)
    
            } if (this.sliderScaleRight) {
                let newWidth = this.width + deltaX
                if (newWidth > this.originalWidth - 6) {
                    newWidth = this.originalWidth - 6
                }
                this.slider.style.width = `${newWidth}px`
    
                this.onScale && this.onScale(newWidth, 0)
    
            } else if (this.sliderDrag) {
                let newPos = this.positionLeft + deltaX
                if (newPos < 0) {
                    newPos = 0
                }
                if (newPos > this.getMaxRange() ) {
                    newPos = this.getMaxRange()
                }
                this.slider.style.left = `${newPos}px`
                this.onMove && this.onMove(-newPos)
            }
            this.sliderBackgroundLeft.style.width = this.slider.style.left
            this.sliderBackgroundRight.style.width = 
                `${parseInt(this.sliderContainer.style.width) - parseInt(this.slider.style.width) - parseInt(this.slider.style.left)  - 6}px`
        }
    
        transformMoveToPercent (value) {
            return value / ( this.originalWidth - 6 )
        }
    
        transformScaleToValue (value) {
            return value / ( this.originalWidth - 6 )
        }
    
        onMove(handler) {
            this.onMove = (value) => handler(this.transformMoveToPercent(value))
        }
    
        onScale(handler) {
            this.onScale = (value, pivot) => handler(this.transformScaleToValue(value), pivot)
        }
    }
    
    return new SliderController()
})();
//--------------------------------------------------------------------------------------------------------------------------------------
// Matrix.js
const Matrix = {
    projection: function (width, height) {
        // Note: This matrix flips the Y axis so that 0 is at the top.
            return [
            2 / width, 0, 0,
            0, 2 / height, 0,
            -1,  -1, 1
        ];
    },

    identity: function() {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ];
    },

    translation: function(tx, ty) {
        return [
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1,
        ];
    },

    rotation: function(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        return [
            c,-s, 0,
            s, c, 0,
            0, 0, 1,
        ];
    },

    scaling: function(sx, sy) {
        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1,
        ];
    },

    multiply: function(a, b) {
        var a00 = a[0 * 3 + 0];
        var a01 = a[0 * 3 + 1];
        var a02 = a[0 * 3 + 2];
        var a10 = a[1 * 3 + 0];
        var a11 = a[1 * 3 + 1];
        var a12 = a[1 * 3 + 2];
        var a20 = a[2 * 3 + 0];
        var a21 = a[2 * 3 + 1];
        var a22 = a[2 * 3 + 2];
        var b00 = b[0 * 3 + 0];
        var b01 = b[0 * 3 + 1];
        var b02 = b[0 * 3 + 2];
        var b10 = b[1 * 3 + 0];
        var b11 = b[1 * 3 + 1];
        var b12 = b[1 * 3 + 2];
        var b20 = b[2 * 3 + 0];
        var b21 = b[2 * 3 + 1];
        var b22 = b[2 * 3 + 2];
        return [
            b00 * a00 + b01 * a10 + b02 * a20,
            b00 * a01 + b01 * a11 + b02 * a21,
            b00 * a02 + b01 * a12 + b02 * a22,
            b10 * a00 + b11 * a10 + b12 * a20,
            b10 * a01 + b11 * a11 + b12 * a21,
            b10 * a02 + b11 * a12 + b12 * a22,
            b20 * a00 + b21 * a10 + b22 * a20,
            b20 * a01 + b21 * a11 + b22 * a21,
            b20 * a02 + b21 * a12 + b22 * a22,
        ];
    },
};
// ------------------------------------------------------------------------------------------------------------------------------------
// GlUtis.js
function compileProgramm(gl, vertexShaderSource, fragmentShaderSource) {
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertexShaderSource);
    gl.compileShader(vertShader);
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragmentShaderSource);
    gl.compileShader(fragShader);
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    return shaderProgram
};

function setupBuffers(gl, vertexData, colorsData) {
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colorsData), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return {
        bufferSize: vertexData.length / 3,
        vertexBuffer,
        colorBuffer
    }
};

function setupTextBuffers(gl, vertexData, colorsData, textCoords, texture) {
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var textCoordsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textCoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textCoords), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colorsData), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    return {
        bufferSize: vertexData.length / 3,
        vertexBuffer,
        colorBuffer,
        textCoordsBuffer,
        texture
    }
};
// DatesController.js
const getDateString = (function(){const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

return function getDateString(timestamp) {
const dat = new Date(timestamp)
return `${monthNames[dat.getMonth()]} ${dat.getDate()}`
}})();
// -------------------------------------------------------------------------------------------------------------------------------------
// Animations.js
class Animation {
    constructor (value, startValue, duration) {
        this.targetValue = value
        this.currentValue = startValue
        this.totalDiff = this.targetValue - this.currentValue
        this.diff = Math.abs(this.totalDiff)
        this.started = false
        this.duration = duration || 1000
    }

    Animate (deltaTime) {
        const valueDiff = this.totalDiff
        if ( this.diff > 0) {
            this.started = true
            const delta = valueDiff / this.duration  * deltaTime
            this.currentValue += delta
            this.diff -= Math.abs(delta)
        } else {
            this.started = false
        }
        return this.currentValue
    }
};
// ---------------------------------------------------------------------------------------------------------------------------------------
// AnimationsContoller.js
const AnimationController = (function(){
    class AnimationController {
        constructor () {
            this.animations = {}
            this.currentTime = 0
        }
    
        AddAnimation (name, targetValue, startValue, duration) {
            if (this.animations[name]) {
                const valueToSet = this.animations[name].currentValue
                this.animations[name] = new Animation(targetValue, valueToSet)
            } else {
                this.animations[name] = new Animation(targetValue, startValue)
            }
    
            if ( !this.animations[name].started ) {
                this.animations[name].time = this.currentTime
            }
        }
    
        Animate (name, newTime) {
            const deltaTime =  newTime - this.animations[name].time
            this.animations[name].time += deltaTime
            return this.animations[name].Animate(deltaTime)
    
        }
    }
    
    return new AnimationController();
})();
// -------------------------------------------------------------------------------------------------------------------------------------
// TooltipContoller.js
const Toooltipcontroller = (function(){
    class Toooltipcontroller {
        constructor(dataManager) {
            this.chartsInfo = dataManager.chosenDataSet.names
            this.dataManager = dataManager
            this.createTooltip()
        }
    
        createTooltip() {
            this.tooltipContainer = document.createElement('div')
            this.tooltipContainer.style.display = "none"
            this.tooltipContainer.style.zIndex = "1000"
            this.tooltipContainer.style.position = "absolute"
            this.tooltipContainer.style.width = "100px"
            this.tooltipContainer.style.height = "100px"
            this.tooltipContainer.style.borderRadius = "10px"
            this.dataContainer = document.createElement('div')
            this.tooltipContainer.appendChild(this.dataContainer)
            this.chartsContainer = []
            for (let chartIndex in this.chartsInfo) {
                let chartContainer = document.createElement('div')
                chartContainer.style.color = this.dataManager.chosenDataSet.colors[chartIndex]
                this.chartsContainer[this.chartsInfo[chartIndex]] = chartContainer
                this.tooltipContainer.appendChild(chartContainer)
            }
            document.getElementById('app').appendChild(this.tooltipContainer)
        }
    
        displayTooltip (e) {
            this.tooltipContainer.style.display = "block"
            this.tooltipContainer.style.backgroundColor = ThemeController.colorSettings.backgoundColor
            this.tooltipContainer.style.boxShadow = ThemeController.colorSettings.tooltip.boxShadow
            this.tooltipContainer.style.color = ThemeController.colorSettings.tooltip.color
            this.tooltipContainer.style.top = `${e.pageY - 100}px`
            this.tooltipContainer.style.left = `${e.pageX + 20}px`
            this.dataManager.getChartPossitonData(e.offsetX / 750)
            const data = this.dataManager.hover
            const dateString = getDateString(data.xPosition)
            this.dataContainer.innerText = dateString
            for (let yName in data.YPossitions) {
                const chartKey = data.chartKeys[yName]
                if(!this.dataManager.isIndexDisabled(chartKey)){
                    this.chartsContainer[yName].innerText = `${yName}: ${data.YPossitions[yName]}`
                } else {
                    this.chartsContainer[yName].innerText = ''
                }
            }
        }
    
        hideTooltip (e) {
            this.tooltipContainer.style.display = "none"
            this.dataManager.hover = null
        }
    }
    return Toooltipcontroller
})();
// ------------------------------------------------------------------------------------------------------------------------------------
// DataManager.js
const DataManager = (function(){
    const disabledChartsIndexes = {}

let instance = null

class DataManager  {
    constructor (gl, gl2, ctx, dataSet) {
        if (instance) {
            return instance
        }
        this.dataSet = dataSet
        this.chosenDataSetIndex = 5
        this.shaderPrograms = []
        this.scaleX = 1
        this.dx = 0
        this.gl = gl
        this.gl2 = gl2
        this.ctx = ctx
        this.chosenDataSet = this.dataSet[this.chosenDataSetIndex]
        this.charTextures = makeTextTextures(this.gl)
        this.setupChartsDisabledOptions()
        this.setChartData()
        instance = this
    }

    getChartsColors () {
        const colors = this.chosenDataSet.colors
        return colors
    }


    setShaderProgram (name, program) {
        this.shaderPrograms[name] = program
    }

    getShaderProgram (name) {
        return this.shaderPrograms[name]
    }

    setupChartsDisabledOptions () {
        for (let name in this.chosenDataSet.names) {
            disabledChartsIndexes[name] = false
        }
    }


    isIndexDisabled (name) {
       return disabledChartsIndexes[name]
    }

    toogleChartDisable (name) {
        disabledChartsIndexes[name] = !disabledChartsIndexes[name]
        this.setChartData()
    }

    findDataSetIndexByName (columns, name)  {
        for (let idx in columns) {
            const dataSet = columns[idx]
            if (dataSet[0] === name) {
                return idx
            }
        }
        return false
    }

    convertDataToPos (posX, posY) {
        return [
            posX,
            posY,
            1
        ]
    }

    drawDates () {
        const width = 750
        const height = 30
        this.ctx.width  = width + 10;
        this.ctx.height = height;
        this.ctx.font = "16px monospace";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = "black";
        this.ctx.clearRect(0, 0,  this.ctx.canvas.width,  this.ctx.canvas.height);
        for (let ii=0; ii < 6; ii++) {
            let datesPossitions = ii / 6 + 0.0001
            this.getChartPossitonData(datesPossitions)
            let date = getDateString(this.hover.xPosition)
            this.ctx.fillText(date, datesPossitions * width, height / 2);
        }
        let datesPossitions = 0.9999999999
        let data = this.getChartPossitonData(datesPossitions)
        let date = getDateString(data.xPosition)
        this.ctx.fillText(date, datesPossitions * width, height / 2);
    }

    getChartVertices(chartVertices, chartIdx) {
        const verticesGraph = new Array(chartVertices.length * 3)
        const colorsArray = new Array(chartVertices.length * 3)
        const colors = Object.values(this.chosenDataSet.colors)

        const color = convertRgbToArray(colors[chartIdx])
        for ( let ii = 0; ii < chartVertices.length; ii++) {
            let posX = chartVertices[ii][0]
            let posY = chartVertices[ii][1]
            const newPos = this.convertDataToPos(posX, posY, this.minX, this.maxX, this.maxY)
            verticesGraph[ii * 3 + 0 ] = newPos[0]
            verticesGraph[ii * 3 + 1] = newPos[1]
            verticesGraph[ii * 3 + 2] = newPos[2]
            colorsArray[ii * 3 + 0 ] = color[0]
            colorsArray[ii * 3 + 1] = color[1]
            colorsArray[ii * 3 + 2] = color[2]
        }
        return { verticesGraph, colorsArray }
    }


    buildLines () {
        const lines = new Array(6 * 9)
        const colors = new Array(6 * 9)
        const labels = new Array(6)
        const step = (this.maxY / 6) | 0
        for (let ii = 0; ii < 9; ii++) {
            lines[ii * 6 + 0 ] = this.minX
            lines[ii * 6 + 1] = ii * step
            lines[ii * 6 + 2] = 1
            lines[ii * 6 + 3 ] = this.maxX
            lines[ii * 6 + 4] = ii * step
            lines[ii * 6 + 5] = 1
            colors[ii * 6 + 0 ] = 100
            colors[ii * 6 + 1] = 100
            colors[ii * 6 + 2] = 100
            colors[ii * 6 + 3 ] = 100
            colors[ii * 6 + 4] = 100
            colors[ii * 6 + 5] = 100
            labels[ii] = `${step * ii}`
        }
        const bufferData = setupBuffers(this.gl, lines, colors)

        return {
            bufferData,
            lines,
            labels
        }
    }

    buildVerticalLine () {
        const lines = new Array(6)
        const colors = new Array(6)
        lines[0] = this.minX
        lines[1] = 0
        lines[2] = 1
        lines[3] = this.minX
        lines[4] = this.maxY
        lines[5] = 1
        colors[0] = 100
        colors[1] = 100
        colors[2] = 100
        colors[3] = 100
        colors[4] = 100
        colors[5] = 100
        const bufferData = setupBuffers(this.gl, lines, colors)

        return {
            bufferData,
            lines
        }
    }

    buildLetterBuffer({ lines, labels }) {
        const labelsBuffers = []
        for (let kk=0; kk < labels.length; kk++) {
            const label = labels[kk]
            const lineY = lines[kk*6 +1]
            for (let ii = 0; ii < label.length; ii++) {
                const char = label[ii]
                let { texture, width, height }= this.charTextures[char]
                const deltaX = this.maxX - this.minX
                width = deltaX / width
                height =  this.maxY / height
                const vertices = [
                    this.minX - width / 4 + ii * width / 3, lineY, 1,
                    this.minX - width / 4 + ii * width / 3+ width, lineY, 1,
                    this.minX - width / 4 + ii * width / 3 + width, lineY + height, 1,
                    this.minX - width / 4 + ii * width / 3+ width, lineY + height, 1,
                    this.minX - width / 4+ ii * width  / 3, lineY  + height, 1,
                    this.minX - width / 4+ ii * width  / 3, lineY, 1
                ]
                const colors = [
                    100, 100, 100,
                    100, 100, 100,
                    100, 100, 100,
                    100, 100, 100,
                    100, 100, 100,
                    100, 100, 100,
                    100, 100, 100,
                    100, 100, 100
                ]
                const textCoords = [
                    0, 1,
                    1, 1,
                    1, 0,
                    1, 0,
                    0, 0,
                    0, 1
                ]

                labelsBuffers.push(setupTextBuffers(this.gl, vertices, colors, textCoords, texture))
            }
        }
        return labelsBuffers

    }

    buildCircles() {
        const circles = {}
        for (let chartIndex in this.chosenDataSet.names){
            if (this.isIndexDisabled(chartIndex)) continue
            let chartName = this.chosenDataSet.names[chartIndex]
            let charColor = convertRgbToArray(this.chosenDataSet.colors[chartIndex]).map(c => c / 255)
            let vertices = [[], []]
            const deltaX = this.maxX - this.minX
            let x = - deltaX / 2
            let y = - this.maxY / 2
            for (let ii = 0; ii <= 360; ii++) {
                const rad = ii * Math.PI / 180
                vertices[0] = vertices[0].concat([this.minX + deltaX / 2 + Math.sin(rad)*deltaX / 2 * 0.025 + x, this.maxY /2 + Math.cos(rad) * this.maxY/2 * 0.025 + y, 1])
                vertices[0] = vertices[0].concat([this.minX + deltaX / 2 + Math.sin(rad)*deltaX / 2 * 0.02 + x, this.maxY /2 + Math.cos(rad) * this.maxY/2 * 0.02 + y , 1])
                vertices[1] = vertices[1].concat([this.minX + deltaX / 2 + Math.sin(rad)*deltaX / 2 * 0.02 + x, this.maxY /2 + Math.cos(rad) * this.maxY/2 * 0.02 + y, 1])
                vertices[1] = vertices[1].concat([this.minX + deltaX / 2 + x, this.maxY / 2 + y, 1])
            }
            circles[chartName] = [
                { buffer: setupBuffers(this.gl, vertices[0], []), color: [...charColor, 1] },
                { buffer: setupBuffers(this.gl, vertices[1], []), color: 'variable' }
            ]
        }
        return circles
    }

    _getXRange () {
        let start = 1
        let end = this.chosenDataSet.columns[0].length - 1
        let diff = (end - start)
        start = Math.floor(start + this.dx*diff)
        end = Math.ceil(start + this.scaleX*diff)
        return {
            start,
            end,
            minX: this.chosenDataSet.columns[0][start],
            maxX: this.chosenDataSet.columns[0][end]
        }
    }

    findYpossition (position, x, range) {
        const xPossitions = this.chosenDataSet.columns[0].slice(range.start, range.end)
        const approximateIndex = Math.floor(position * xPossitions.length)
        const leftPositionDiff = Math.abs(xPossitions[approximateIndex] - x)
        const rightPositionDiff = Math.abs(xPossitions[approximateIndex + 1] -x)
        let index = approximateIndex
        if (rightPositionDiff < leftPositionDiff) {
            index = approximateIndex + 1
        }
        const YPossitions = {}
        const names = Object.values(this.chosenDataSet.names)
        const chartKeys = Object.keys(this.chosenDataSet.names)
        for ( let ii= 1; ii <= names.length; ii ++) {
            const values = this.chosenDataSet.columns[ii].slice(range.start, range.end)
            YPossitions[names[ii-1]] = values[index]
            chartKeys[names[ii-1]] = chartKeys[ii-1]
        }
        return {
            YPossitions,
            chartKeys,
            xPosition: xPossitions[index]
        }
    }

    findActualXPossition (possition, range) {
        return Math.floor(range.maxX + possition * (range.maxX - range.minX))
    }

    getChartPossitonData (possition) {
        const range = this._getXRange()
        const { YPossitions, xPosition, chartKeys} = this.findYpossition(possition, this.findActualXPossition(possition, range), range)
        this.hover = {
            xPosition,
            YPossitions,
            possition,
            chartKeys
        }
        return this.hover
    }   

    setChartData () {
        const data = this.chosenDataSet
        const names = Object.keys(data.names)
        const xPositions = data.columns[0].slice(1, data.columns[0].length)
        const yPositions = new Array(names.length)
        const chartVertices = new Array(names.length)
        const chartVerticesGl = new Array(names.length)
        const chartVerticesGl2 = new Array(names.length)

        for ( let ii = 0; ii < names.length; ii++) {
            if (this.isIndexDisabled(names[ii])) {
                continue
            }
            const idx = this.findDataSetIndexByName(data.columns, names[ii])
            yPositions[ii] = data.columns[idx].slice(1, data.columns[idx].length)
            chartVertices[ii] = new Array(xPositions.length)
        }

        this.minX = xPositions[0]
        this.maxX = xPositions[xPositions.length-1]

        let maxY = 0

        for (let ii = 0; ii < xPositions.length; ii++) {
            let tmpMax = 0
            for (let setIdx in chartVertices) {
                chartVertices[setIdx][ii] = [xPositions[ii], yPositions[setIdx][ii]]
                if ( yPositions[setIdx][ii] > tmpMax ) {
                    tmpMax = yPositions[setIdx][ii]
                }
            }
            if (tmpMax > maxY) {
                maxY = tmpMax
            }
        }
        this.maxY = maxY || this.maxY
        for (let chartIdx in chartVertices) {
            const { verticesGraph, colorsArray} = this.getChartVertices(chartVertices[chartIdx], chartIdx)
            chartVerticesGl[chartIdx] = setupBuffers(this.gl, verticesGraph, colorsArray)
            chartVerticesGl2[chartIdx] = setupBuffers(this.gl2, verticesGraph, colorsArray)
        }
        const lines = this.buildLines()
        const circles = this.buildCircles()


        AnimationController.AddAnimation('MaxY', this.maxY, this.maxY)
        AnimationController.AddAnimation('ScaleX', 1, 1, 1)
        AnimationController.AddAnimation('Pivot', 0, 0, 0)
        AnimationController.AddAnimation('Dx', 0, 0, 0)


        SliderController.onScale( (scale, dx) => {
            this.scaleX =  isFinite(scale) ? scale : this.scaleX
            AnimationController.AddAnimation('ScaleX', 1/scale, 1, 1)
            this.drawDates()
            if (dx !== undefined) {
                AnimationController.AddAnimation('Pivot', dx, dx, 0, 10)
            }
        })
        SliderController.onMove( (move) => {
            this.dx = isFinite(move) ? -move : this.dx
            AnimationController.AddAnimation('Dx', move, move, 0)
            this.drawDates()
        })

        this.drawDates()
        this.dataToDraw = {
            chartVerticesGl,
            chartVerticesGl2,
            lines,
            circles,
            minX: this.minX,
            maxX: this.maxX,
            maxY: this.maxY,
            verticalLine: this.buildVerticalLine(),
            letterInfo: this.buildLetterBuffer(lines)
        }
    }
}

return DataManager
})();
// -------------------------------------------------------------------------------------------------------------------------------------
// render.js
const render = (function() {
    const vertCode =
        'attribute vec4 a_color;' +
        'attribute vec3 coordinates;' +
        'uniform mat3 u_matrix;' +
        'varying vec4 v_color;' +
        'void main(void) {' +
        ' gl_Position = vec4((u_matrix * coordinates).xy, 0.9, 1.0);' +
        ' v_color = a_color;' +
        '}';
    
    const vertCodeLines =
        'attribute vec4 a_color;' +
        'attribute vec3 coordinates;' +
        'uniform mat3 u_matrix;' +
        'varying vec4 v_color; ' +
        'void main(void) {' +
        ' gl_Position = vec4((u_matrix * coordinates).xy, 0.5, 1.0);' +
        ' v_color = a_color;' +
        '}';
    
    // Fragment shader source code
    const fragCode =
        'precision mediump float;' +
        'varying vec4 v_color;' +
        'void main(void) {' +
        'gl_FragColor = vec4( v_color.xyz, 1.0);' +
        '}';
    
    const textVertShader =
        'attribute vec3 coordinates;' +
        'uniform mat3 u_matrix;' +
        'attribute vec2 a_texcoord;' +
        'varying vec2 v_texcoord;' +
        'void main(void) {' +
        ' gl_Position = vec4((u_matrix * coordinates).xy, 0.0, 1.0);' +
        ' v_texcoord = a_texcoord;' +
        '}';
    
    const textFragShader =
        'precision mediump float;' +
        'uniform vec4 u_color;' +
        'varying vec2 v_texcoord;' +
        'uniform sampler2D u_texture;' +
        'void main(void) {' +
        '   gl_FragColor = texture2D(u_texture, v_texcoord) * u_color;' +
        '}';
    
    const circleFragShader =
        'precision mediump float;' +
        'uniform vec4 u_color;' +
        'uniform sampler2D u_texture;' +
        'void main(void) {' +
        '   gl_FragColor = u_color;' +
        '}';
    
    const circleVertShader =
        'attribute vec3 coordinates;' +
        'uniform mat3 u_matrix;' +
        'void main(void) {' +
        ' gl_Position = vec4((u_matrix * coordinates).xy, 0.0, 1.0);' +
        '}';
    
    let package = {};
    
    package.compileChartShaderProgram = function compileChartShaderProgram (gl) {
        return compileProgramm(gl, vertCode, fragCode)
    }
    
    package.compileLineShaderProgram = function compileLineShaderProgram (gl) {
        return compileProgramm(gl, vertCodeLines, fragCode)
    }
    
    package.compileTextShaderProgram = function compileTextShaderProgram (gl) {
        return compileProgramm(gl, textVertShader, textFragShader)
    }
    
    package.compileCircleShaderProgram = function compileCircleShaderProgram (gl) {
        return compileProgramm(gl, circleVertShader, circleFragShader)
    }
    
    package.drawGraphMatrixes = function drawGraphMatrixes(gl, shaderProgram, buffersData, matrix) {
        const { bufferSize, vertexBuffer, colorBuffer } = buffersData
        gl.useProgram(shaderProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        var coord = gl.getAttribLocation(shaderProgram, "coordinates");
        var colorLocation = gl.getAttribLocation(shaderProgram, "a_color");
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(colorLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        var size = 3;                 // 3 components per iteration
        var type = gl.UNSIGNED_BYTE;  // the data is 8bit unsigned values
        var normalize = true;         // normalize the data (convert from 0-255 to 0-1)
        var stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;               // start at the beginning of the buffer
        gl.vertexAttribPointer(
            colorLocation, size, type, normalize, stride, offset);
        gl.enableVertexAttribArray(coord);
        const Umatrix = gl.getUniformLocation(shaderProgram, "u_matrix");
         gl.enable(gl.DEPTH_TEST);
        gl.uniformMatrix3fv(Umatrix, false, matrix);
        gl.viewport(0,0, gl.canvas.width, gl.canvas.height);
        gl.drawArrays(gl.LINE_STRIP, 0, bufferSize);
    }
    
    package.drawCircles = function drawCircles(gl, shaderProgram, buffersData, matrix, color) {
        const { bufferSize, vertexBuffer } = buffersData
        gl.useProgram(shaderProgram);
        var coord = gl.getAttribLocation(shaderProgram, "coordinates");
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    
        gl.enableVertexAttribArray(coord);
        const Umatrix = gl.getUniformLocation(shaderProgram, "u_matrix");
        const u_color = gl.getUniformLocation(shaderProgram, "u_color");
    
        gl.enable(gl.DEPTH_TEST);
    
        gl.uniformMatrix3fv(Umatrix, false, matrix);
        gl.uniform4fv(u_color, color);
        gl.viewport(0,0, gl.canvas.width, gl.canvas.height);
    
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, bufferSize);
    }
    
    package.drawLines = function drawLines(gl, shaderProgram, buffersData, matrix) {
        const { bufferSize, vertexBuffer, colorBuffer } = buffersData
        gl.useProgram(shaderProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        var coord = gl.getAttribLocation(shaderProgram, "coordinates");
        var colorLocation = gl.getAttribLocation(shaderProgram, "a_color");
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(coord);
        gl.enableVertexAttribArray(colorLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        var size = 3;                 // 3 components per iteration
        var type = gl.UNSIGNED_BYTE;  // the data is 8bit unsigned values
        var normalize = true;         // normalize the data (convert from 0-255 to 0-1)
        var stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;               // start at the beginning of the buffer
        gl.vertexAttribPointer(
            colorLocation, size, type, normalize, stride, offset);
        const Umatrix = gl.getUniformLocation(shaderProgram, "u_matrix");
        gl.uniformMatrix3fv(Umatrix, false, matrix);
        gl.drawArrays(gl.LINES, 0, bufferSize);
    }
    
    
    package.drawLetter = function drawLetter (gl, shaderProgram, buffersData, matrix) {
        const { bufferSize, vertexBuffer, colorBuffer, textCoordsBuffer, texture } = buffersData
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.depthMask(false);
        gl.useProgram(shaderProgram);
        var coord = gl.getAttribLocation(shaderProgram, "coordinates");
        var colorLocation = gl.getUniformLocation(shaderProgram, "u_color");
        var textCoord = gl.getAttribLocation(shaderProgram,  "a_texcoord");
        var textureLocation = gl.getUniformLocation(shaderProgram, "u_texture");
        var Umatrix = gl.getUniformLocation(shaderProgram, "u_matrix");
    
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(coord);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, textCoordsBuffer);
        gl.vertexAttribPointer(textCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(textCoord);
    
    
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.uniform4fv(colorLocation, [0.4, 0.4, 0.4, 1])
        gl.uniformMatrix3fv(Umatrix, false, matrix);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(textureLocation, 0)
        gl.drawArrays(gl.TRIANGLE_FAN, 0, bufferSize);
    }
    
    
    const defaultParams = {
        Dx: 0,
        Dy: 0,
        ScaleX: 1,
        ScaleY: 1,
        Pivot: 0
    }
    
    package.buildDimensions = function buildDimensions(x0, x1, y0, y1) {
        return {
            x0,
            x1,
            y0,
            y1
        }
    }
    
    package.buildMatrix = function buildMatrix (dimensions, params) {
        const deltaX = dimensions.x1 - dimensions.x0
        const deltaY = dimensions.y1 - dimensions.y0
    
        let matrix = Matrix.projection(deltaX, deltaY)
        matrix = Matrix.multiply( matrix, Matrix.translation(deltaX*params.Dx * params.ScaleX + deltaX*params.Pivot , deltaY + params.Dy ) )
        matrix = Matrix.multiply(matrix, Matrix.scaling(params.ScaleX, params.ScaleY))
        matrix = Matrix.multiply( matrix, Matrix.translation(-dimensions.x0 - deltaX*params.Pivot / params.ScaleX, -deltaY - dimensions.y0) )
        return matrix
    }
    
    package.clearGl = function clearGl (gl) {
        const color = convertRgbToArray(ThemeController.colorSettings.backgoundColor)
        gl.clearColor(color[0] / 255, color[1]/255, color[2]/255, 1)
    
        gl.enable(gl.CULL_FACE)
        gl.enable(gl.DEPTH_TEST)
    
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.viewport(0,0, gl.canvas.clientWidth, gl.canvas.clientHeight)
    }
    
    package.drawScene = function drawScene (clock) {
        const dataManager = new DataManager()
        const charData = dataManager.dataToDraw
        const gl = dataManager.gl
        const gl2 = dataManager.gl2
    
        const glChartShaderProgram = dataManager.getShaderProgram('glChartShaderProgram')
        const gl2ChartShaderProgram = dataManager.getShaderProgram('gl2ChartShaderProgram')
        const lineShaderProgram = dataManager.getShaderProgram('gl2LineShaderProgram')
        const textShaderProgram = dataManager.getShaderProgram('glTextShaderProgram')
        const circleShaderProgram = dataManager.getShaderProgram('glCircleShaderProgram')
    
        const maxY = AnimationController.Animate('MaxY', clock)
        AnimationController.currentTime = clock
        const dimensions = package.buildDimensions(charData.minX, charData.maxX, 0, maxY)
        const { bufferData: linesBufferData } = charData.lines
    
        package.clearGl(gl)
        package.clearGl(gl2)
    
        package.drawLines(gl, lineShaderProgram, linesBufferData, package.buildMatrix(dimensions, defaultParams))
        for (let bufferInfo of charData.letterInfo) {
            package.drawLetter(gl, textShaderProgram, bufferInfo, package.buildMatrix(dimensions, defaultParams))
        }
    
        for (let chartIdx in charData.chartVerticesGl) {
            package.drawGraphMatrixes(gl, glChartShaderProgram, charData.chartVerticesGl[chartIdx], package.buildMatrix(dimensions, {
                ...defaultParams,
                ScaleX: AnimationController.Animate('ScaleX', clock),
                Pivot: AnimationController.Animate('Pivot', clock),
                Dx: AnimationController.Animate('Dx', clock)
            }))
            package.drawGraphMatrixes(gl2, gl2ChartShaderProgram, charData.chartVerticesGl2[chartIdx], package.buildMatrix(dimensions, defaultParams))
        }
    
        if (dataManager.hover) {
            const Dx = dataManager.hover.possition
            package.drawLines(gl, lineShaderProgram, charData.verticalLine.bufferData, package.buildMatrix(dimensions, {
                ...defaultParams,
                Dx
            }))
            for (let chartName in charData.circles) {
                let circlesBuffers = charData.circles[chartName]
                let yPos = dataManager.hover.YPossitions[chartName]
                for (let bufferInfo of circlesBuffers) {
                    let color = bufferInfo.color
                    if (color === 'variable') {
                        color = [...convertRgbToArray(ThemeController.colorSettings.backgoundColor).map(c => c / 255), 1]
                    }
                    package.drawCircles(gl, circleShaderProgram, bufferInfo.buffer, package.buildMatrix(dimensions, {
                        ...defaultParams,
                        Dx,
                        Dy: yPos
                    }), color)
                }
    
            }
        }
    
    
        requestAnimationFrame(drawScene)
    }
    return package
})();    
// -------------------------------------------------------------------------------------------------------------------------------------
// index.js
function init() {
    var canvas = document.getElementById('glcanvas');
    var gl = canvas.getContext('webgl');
    var canvas1 = document.getElementById('glcanvas1');
    var gl1 = canvas1.getContext('webgl');
    var dateCanvas = document.getElementById('dateCanvas');
    var ctx = dateCanvas.getContext('2d');

    fetch('/data').then(function(response) {
        return response.json();
    }).then(function(data) {
        const dataManager = new DataManager(gl, gl1, ctx, data)
        /*======= Defining and storing the geometry ======*/
        dataManager.setShaderProgram('glChartShaderProgram', render.compileChartShaderProgram(gl))
        dataManager.setShaderProgram('gl2ChartShaderProgram', render.compileChartShaderProgram(gl1))
        dataManager.setShaderProgram('gl2LineShaderProgram', render.compileLineShaderProgram(gl))
        dataManager.setShaderProgram('glTextShaderProgram', render.compileTextShaderProgram(gl))
        dataManager.setShaderProgram('glCircleShaderProgram', render.compileCircleShaderProgram(gl))
        const tooltipController = new Toooltipcontroller(dataManager)
        canvas.addEventListener('mousemove', (e) => tooltipController.displayTooltip(e))
        canvas.addEventListener('mouseleave', () => tooltipController.hideTooltip())
        renderControllButtons(dataManager)
        requestAnimationFrame(render.drawScene.bind(this));
    });
}

init();