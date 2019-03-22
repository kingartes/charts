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
})()
