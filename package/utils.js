function convertRgbToArray (rgb) {
    const rValue = parseInt(rgb.slice(1, 3), 16)
    const gValue = parseInt(rgb.slice(3, 5), 16)
    const bValue = parseInt(rgb.slice(5, 7), 16)
    return [rValue, gValue, bValue]
}