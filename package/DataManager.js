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
            console.log(disabledChartsIndexes, chartIndex)
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