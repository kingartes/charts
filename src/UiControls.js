export function renderControllButtons (dataManager) {
    const buttonsParams = dataManager.getChartsColors()
    const buttonsContainer = document.getElementById('controlButtons')
    for ( let name in buttonsParams ) {
        const checkboxElement = document.createElement('input')
        checkboxElement.type = 'checkbox'
        checkboxElement.checked = !dataManager.isIndexDisabled(name)
        const labelElement  = document.createElement('label')
        const textNode = document.createTextNode(name)
        labelElement.appendChild(checkboxElement)
        labelElement.appendChild(textNode)
        buttonsContainer.appendChild(labelElement)
        checkboxElement.addEventListener('click', () => {
            dataManager.toogleChartDisable(name)
        })
    }
}