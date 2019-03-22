import ThemeController from "./ThemeController";

export function renderControllButtons (dataManager) {
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
}