var textCtx = document.createElement("canvas").getContext("2d");

function makeTextCanvas(text, width, height) {
    textCtx.canvas.width  = width;
    textCtx.canvas.height = height;
    textCtx.font = "20px monospace";
    textCtx.textAlign = "center";
    textCtx.textBaseline = "middle";
    textCtx.fillStyle = "white";
    textCtx.clearRect(0, 0, textCtx.canvas.width, textCtx.canvas.height);
    textCtx.fillText(text, width / 2, height / 2);
    return textCtx.canvas;
}

export function makeTextTextures (gl) {
    const textTexturesMap = {}
    const textMap = {
        "a": "a", "b": "b", "c": "c", "d": "d", "e": "e", "f": "f", "g": "g", "h": "h",
        "i": "i", "j": "j", "k": "k", "l": "l", "m": "m", "n": "n", "o": "o", "p": "p",
        "q": "q", "r": "r", "s": "s", "t": "t", "u": "u", "v": "v", "w": "w", "x": "x",
        "y": "y", "z": "z", "1": "1", "2": "2", "3": "3", "4": "4", "5": "5", "6": "6",
        "7": "7", "8": "8", "9": "9", "0": "0"
    }

    for ( let key in textMap ) {
        var textCanvas = makeTextCanvas(textMap[key], 32, 32)
        var textWidth  = textCanvas.width
        var textHeight = textCanvas.height
        var textTex = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, textTex)
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        textTexturesMap[key] = {
            texture: textTex,
            width: textWidth,
            height: textHeight,
            name
        }
    }
    return textTexturesMap
}

