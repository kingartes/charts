export class Toooltipcontroller {
    constructor(chartsInfo = [1, 1, 1, 1]) {
        this.chartsInfo = chartsInfo
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
        for (let chartInfo in this.chartsInfo) {
            let chartContainer = document.createElement('div')
            // chartContainer.style.color = chartInfo.color
            this.chartsContainer[chartInfo.name] = chartContainer
            this.tooltipContainer.appendChild(chartContainer)
        }
        document.getElementById('app').appendChild(this.tooltipContainer)
    }

    displayTooltip (e) {
        this.tooltipContainer.style.display = "block"
        this.tooltipContainer.style.top = `${e.pageY - 100}px`
        this.tooltipContainer.style.left = `${e.pageX + 20}px`
    }

    hideTooltip (e) {
        this.tooltipContainer.style.display = "none"
    }
}