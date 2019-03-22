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
        dataManager.setShaderProgram('glChartShaderProgram', render.compileChartShaderProgram(gl))
        dataManager.setShaderProgram('gl2ChartShaderProgram', render.compileChartShaderProgram(gl1))
        dataManager.setShaderProgram('gl2LineShaderProgram', render.compileLineShaderProgram(gl))
        dataManager.setShaderProgram('glTextShaderProgram', render.compileTextShaderProgram(gl))
        dataManager.setShaderProgram('glCircleShaderProgram', render.compileCircleShaderProgram(gl))
        const tooltipController = new Toooltipcontroller(dataManager)
        canvas.addEventListener('mousemove', (e) => tooltipController.displayTooltip(e))
        canvas.addEventListener('mouseleave', () => tooltipController.hideTooltip())
        renderControllButtons(dataManager)
        requestAnimationFrame(render.drawScene.bind(this));
    });
}

init();