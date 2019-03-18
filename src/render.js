import {convertRgbToString} from "./utils";
import DataManager from "./DataManager";
import {Matrix} from "./Matrix";
import AnimationController from "./AnimationController";
import {compileProgramm} from "./GlUtils";

const vertCode =
    'attribute vec4 a_color;' +
    'attribute vec3 coordinates;' +
    'uniform mat3 u_matrix;' +
    'varying vec4 v_color;' +
    'void main(void) {' +
    ' gl_Position = vec4((u_matrix * coordinates).xy, 0.9, 1.0);' +
    ' v_color = a_color;' +
    '}';

const vertCodeLines =
    'attribute vec4 a_color;' +
    'attribute vec3 coordinates;' +
    'uniform mat3 u_matrix;' +
    'varying vec4 v_color; ' +
    'void main(void) {' +
    ' gl_Position = vec4((u_matrix * coordinates).xy, 0.5, 1.0);' +
    ' v_color = a_color;' +
    '}';

// Fragment shader source code
const fragCode =
    'precision mediump float;' +
    'varying vec4 v_color;' +
    'void main(void) {' +
    'gl_FragColor = vec4( v_color.xyz, 1.0);' +
    '}';

const textVertShader =
    'attribute vec3 coordinates;' +
    'uniform mat3 u_matrix;' +
    'attribute vec2 a_texcoord;' +
    'varying vec2 v_texcoord;' +
    'void main(void) {' +
    ' gl_Position = vec4((u_matrix * coordinates).xy, 0.0, 1.0);' +
    ' v_texcoord = a_texcoord;' +
    '}';

const textFragShader =
    'precision mediump float;' +
    'uniform vec4 u_color;' +
    'varying vec2 v_texcoord;' +
    'uniform sampler2D u_texture;' +
    'void main(void) {' +
    '   gl_FragColor = texture2D(u_texture, v_texcoord) * u_color;' +
    '}';

const circleFragShader =
    'precision mediump float;' +
    'uniform vec4 u_color;' +
    'uniform sampler2D u_texture;' +
    'void main(void) {' +
    '   gl_FragColor = u_color;' +
    '}';

const circleVertShader =
    'attribute vec3 coordinates;' +
    'uniform mat3 u_matrix;' +
    'void main(void) {' +
    ' gl_Position = vec4((u_matrix * coordinates).xy, 0.0, 1.0);' +
    '}';



export function compileChartShaderProgram (gl) {
    return compileProgramm(gl, vertCode, fragCode)
}

export function compileLineShaderProgram (gl) {
    return compileProgramm(gl, vertCodeLines, fragCode)
}

export function compileTextShaderProgram (gl) {
    return compileProgramm(gl, textVertShader, textFragShader)
}

export function compileCircleShaderProgram (gl) {
    return compileProgramm(gl, circleVertShader, circleFragShader)
}

export function drawGraphMatrixes(gl, shaderProgram, buffersData, matrix) {
    const { bufferSize, vertexBuffer, colorBuffer } = buffersData
    gl.useProgram(shaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");
    var colorLocation = gl.getAttribLocation(shaderProgram, "a_color");
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    var size = 3;                 // 3 components per iteration
    var type = gl.UNSIGNED_BYTE;  // the data is 8bit unsigned values
    var normalize = true;         // normalize the data (convert from 0-255 to 0-1)
    var stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;               // start at the beginning of the buffer
    gl.vertexAttribPointer(
        colorLocation, size, type, normalize, stride, offset);
    gl.enableVertexAttribArray(coord);
    const Umatrix = gl.getUniformLocation(shaderProgram, "u_matrix");
     gl.enable(gl.DEPTH_TEST);
    gl.uniformMatrix3fv(Umatrix, false, matrix);
    gl.viewport(0,0, gl.canvas.width, gl.canvas.height);
    gl.drawArrays(gl.LINE_STRIP, 0, bufferSize);
}

export function drawCircles(gl, shaderProgram, buffersData, matrix, color) {
    const { bufferSize, vertexBuffer } = buffersData
    gl.useProgram(shaderProgram);
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(coord);
    const Umatrix = gl.getUniformLocation(shaderProgram, "u_matrix");
    const u_color = gl.getUniformLocation(shaderProgram, "u_color");

    gl.enable(gl.DEPTH_TEST);

    gl.uniformMatrix3fv(Umatrix, false, matrix);
    gl.uniform4fv(u_color, color);
    gl.viewport(0,0, gl.canvas.width, gl.canvas.height);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, bufferSize);
}

export function drawLines(gl, shaderProgram, buffersData, matrix) {
    const { bufferSize, vertexBuffer, colorBuffer } = buffersData
    gl.useProgram(shaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");
    var colorLocation = gl.getAttribLocation(shaderProgram, "a_color");
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);
    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    var size = 3;                 // 3 components per iteration
    var type = gl.UNSIGNED_BYTE;  // the data is 8bit unsigned values
    var normalize = true;         // normalize the data (convert from 0-255 to 0-1)
    var stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;               // start at the beginning of the buffer
    gl.vertexAttribPointer(
        colorLocation, size, type, normalize, stride, offset);
    const Umatrix = gl.getUniformLocation(shaderProgram, "u_matrix");
    gl.uniformMatrix3fv(Umatrix, false, matrix);
    gl.drawArrays(gl.LINES, 0, bufferSize);
}


export function drawLetter (gl, shaderProgram, buffersData, matrix) {
    const { bufferSize, vertexBuffer, colorBuffer, textCoordsBuffer, texture } = buffersData
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    gl.useProgram(shaderProgram);
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");
    var colorLocation = gl.getUniformLocation(shaderProgram, "u_color");
    var textCoord = gl.getAttribLocation(shaderProgram,  "a_texcoord");
    var textureLocation = gl.getUniformLocation(shaderProgram, "u_texture");
    var Umatrix = gl.getUniformLocation(shaderProgram, "u_matrix");

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);

    gl.bindBuffer(gl.ARRAY_BUFFER, textCoordsBuffer);
    gl.vertexAttribPointer(textCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(textCoord);


    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.uniform4fv(colorLocation, [0.4, 0.4, 0.4, 1])
    gl.uniformMatrix3fv(Umatrix, false, matrix);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(textureLocation, 0)
    gl.drawArrays(gl.TRIANGLE_FAN, 0, bufferSize);
}


const defaultParams = {
    Dx: 0,
    Dy: 0,
    ScaleX: 1,
    ScaleY: 1,
    Pivot: 0
}

export function buildDimensions(x0, x1, y0, y1) {
    return {
        x0,
        x1,
        y0,
        y1
    }
}

export function buildMatrix (dimensions, params) {
    const deltaX = dimensions.x1 - dimensions.x0
    const deltaY = dimensions.y1 - dimensions.y0

    let matrix = Matrix.projection(deltaX, deltaY)
    matrix = Matrix.multiply( matrix, Matrix.translation(deltaX*params.Dx * params.ScaleX + deltaX*params.Pivot , deltaY + params.Dy ) )
    matrix = Matrix.multiply(matrix, Matrix.scaling(params.ScaleX, params.ScaleY))
    matrix = Matrix.multiply( matrix, Matrix.translation(-dimensions.x0 - deltaX*params.Pivot / params.ScaleX, -deltaY - dimensions.y0) )
    return matrix
}

export function clearGl (gl) {
    gl.clearColor(1, 1, 1, 1);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0,0, gl.canvas.clientWidth, gl.canvas.clientHeight);
}

export function drawScene (clock) {
    const dataManager = new DataManager()
    const charData = dataManager.dataToDraw
    const gl = dataManager.gl
    const gl2 = dataManager.gl2

    const glChartShaderProgram = dataManager.getShaderProgram('glChartShaderProgram')
    const gl2ChartShaderProgram = dataManager.getShaderProgram('gl2ChartShaderProgram')
    const lineShaderProgram = dataManager.getShaderProgram('gl2LineShaderProgram')
    const textShaderProgram = dataManager.getShaderProgram('glTextShaderProgram')
    const circleShaderProgram = dataManager.getShaderProgram('glCircleShaderProgram')

    const maxY = AnimationController.Animate('MaxY', clock)
    AnimationController.currentTime = clock
    const dimensions = buildDimensions(charData.minX, charData.maxX, 0, maxY)
    const { bufferData: linesBufferData } = charData.lines

    clearGl(gl)
    clearGl(gl2)

    drawLines(gl, lineShaderProgram, linesBufferData, buildMatrix(dimensions, defaultParams))
    for (let bufferInfo of charData.letterInfo) {
        drawLetter(gl, textShaderProgram, bufferInfo, buildMatrix(dimensions, defaultParams))
    }

    for (let chartIdx in charData.chartVerticesGl) {
        drawGraphMatrixes(gl, glChartShaderProgram, charData.chartVerticesGl[chartIdx], buildMatrix(dimensions, {
            ...defaultParams,
            ScaleX: AnimationController.Animate('ScaleX', clock),
            Pivot: AnimationController.Animate('Pivot', clock),
            Dx: AnimationController.Animate('Dx', clock)
        }))
        drawGraphMatrixes(gl2, gl2ChartShaderProgram, charData.chartVerticesGl2[chartIdx], buildMatrix(dimensions, defaultParams))
    }
    for (let bufferInfo of charData.circlesBuffers) {
        drawCircles(gl, circleShaderProgram, bufferInfo.buffer, buildMatrix(dimensions, defaultParams), bufferInfo.color)
    }
    requestAnimationFrame(drawScene)
}

