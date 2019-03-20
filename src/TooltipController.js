import {getDateString} from "./DatesController";

export class Toooltipcontroller {
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
        this.tooltipContainer.style.backgroundColor = "white"
        this.tooltipContainer.style.boxShadow = "1px 4px 0px rgb(190, 190, 190)"
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