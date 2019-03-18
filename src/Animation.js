

export default class Animation {
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
}