import Animation from './Animation'

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

export default new AnimationController()
