class SliderController {
    constructor () {
        this.sliderDrag = false
        this.sliderScaleLeft = false
        this.x = 0

        this.slider = document.getElementById("slider")
        this.sliderContainer = document.getElementById("slider-container")
        this.sliderBackground = document.getElementById("slider-background")
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

export default new SliderController()