/*======= Creating a canvas =========*/
import {
    compileChartShaderProgram,
    compileCircleShaderProgram,
    compileLineShaderProgram,
    compileTextShaderProgram,
    drawScene
} from "./render";
import DataManager from "./DataManager";
import {renderControllButtons} from "./UiControls";
import AnimationController from "./AnimationController";
import SliderController from "./SliderController";

function init() {
    var canvas = document.getElementById('glcanvas');
    var gl = canvas.getContext('webgl');
    var canvas1 = document.getElementById('glcanvas1');
    var gl1 = canvas1.getContext('webgl');

    const dataManager = new DataManager(gl, gl1)
    /*======= Defining and storing the geometry ======*/
    dataManager.setShaderProgram('glChartShaderProgram', compileChartShaderProgram(gl))
    dataManager.setShaderProgram('gl2ChartShaderProgram', compileChartShaderProgram(gl1))
    dataManager.setShaderProgram('gl2LineShaderProgram', compileLineShaderProgram(gl))
    dataManager.setShaderProgram('glTextShaderProgram', compileTextShaderProgram(gl))
    dataManager.setShaderProgram('glCircleShaderProgram', compileCircleShaderProgram(gl))
    renderControllButtons(dataManager)
    requestAnimationFrame(drawScene.bind(this));
}

init()