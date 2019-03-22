const DAY_THEME = 'DAY_THEME'
const NIGHT_THEME = 'NIGHT_THEME'

const COLOR_SETTINGS = {
    [DAY_THEME]: {
        backgoundColor: '#ffffff',
        tooltip: {
            boxShadow: "1px 4px 0px rgb(190, 190, 190)",
            color: "black"
        }
    },
    [NIGHT_THEME]: {
        backgoundColor: '#242f3e',
        tooltip: {
            boxShadow: "1px 4px 0px rgb(50, 50, 50)",
            color: "white"
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
        document.getElementById('controlButtons').style.setProperty(`--background-color`, ThemeController.colorSettings.backgoundColor)
        console.log(this.colorSettings.backgoundColor, document.body.style.backgroundColor)
    }
}

export default new ThemeController()