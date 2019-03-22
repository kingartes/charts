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
import {Toooltipcontroller} from "./TooltipController";

function init() {
    var canvas = document.getElementById('glcanvas');
    var gl = canvas.getContext('webgl');
    var canvas1 = document.getElementById('glcanvas1');
    var gl1 = canvas1.getContext('webgl');
    var dateCanvas = document.getElementById('dateCanvas');
    var ctx = dateCanvas.getContext('2d');

    fetch('/data').then(function(response) {
        return response.json();
    }).then(function(data) {
        const dataManager = new DataManager(gl, gl1, ctx, data)
        /*======= Defining and storing the geometry ======*/
        dataManager.setShaderProgram('glChartShaderProgram', compileChartShaderProgram(gl))
        dataManager.setShaderProgram('gl2ChartShaderProgram', compileChartShaderProgram(gl1))
        dataManager.setShaderProgram('gl2LineShaderProgram', compileLineShaderProgram(gl))
        dataManager.setShaderProgram('glTextShaderProgram', compileTextShaderProgram(gl))
        dataManager.setShaderProgram('glCircleShaderProgram', compileCircleShaderProgram(gl))
        const tooltipController = new Toooltipcontroller(dataManager)
        canvas.addEventListener('mousemove', (e) => tooltipController.displayTooltip(e))
        canvas.addEventListener('mouseleave', () => tooltipController.hideTooltip())
        renderControllButtons(dataManager)
        requestAnimationFrame(drawScene.bind(this));
    });
}

init()