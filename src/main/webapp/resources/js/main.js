$(function () {

    const MAX_X = 5;
    const MIN_X = -3;
    const MAX_Y = 5;
    const MIN_Y = -3;

    function isNumber(number) {
        return !isNaN(number) && isFinite(number);
    }

    function validateX() {
        let x = getX();
        let input = $("#x-input");

        if (isNumber(x) && x >= MIN_X && x <= MAX_X) {

            return true;
        }
        return false;
    }

    function validateY() {

        let graphMode = $(".graph_point_info").val();
        let y = parseFloat($("#graph-y").val());
        if (graphMode === "true" && isNumber(y) && y >= MIN_Y && y <= MAX_Y) {
            return true;
        }
        return $("input[type='radio']").is(":checked");

    }

    function validateR() {
        let r = getR();
        return isNumber(r);

    }

    function validateData() {
        let valid = validateX() && validateY() && validateR();
        if (!valid) displayMessage("Data is invalid, please check restrictions (current Y value is " + getY() + ")");
        return validateX() && validateY()&& validateR();
    }

    function getY() {
        if ($("input[type='radio']").is(":checked")) {
            return parseFloat($("input[type='radio']:checked").val());
        } else {
            let graphMode = $(".graph_point_info").val();
            let y = parseFloat($("#graph-y").val());
            if (graphMode === "true" && isNumber(y)) {
                return y;
            }
        }
        return NaN;
    }

    function getX() {
        let x = $("#x-input").val();
        if (typeof x != "undefined") {
            x = x.replace(",", ".");
            if (/^[+-]?[0-9]+\.?[0-9]*$/.test(x)) {
                return parseFloat(x);
            }
        }
        return NaN;

    }

    function getR() {
        return parseFloat($("#r-options").val());
    }

    function drawDot(dot, x, y, r) {
        if (isNumber(x) && isNumber(y) && isNumber(r)) {
            let {absoluteX, absoluteY} = getAbsoluteOffsetFromXYCoords(x, y, r);
            drawDotInAbsoluteCoord(dot, absoluteX, absoluteY);

        } else {
            dot.attr("r", 0);
        }
    }

    function drawDotInAbsoluteCoord(dot, absoluteX, absoluteY) {
        dot.attr("r", 3);
        dot.attr("cx", absoluteX);
        dot.attr("cy", absoluteY);
    }

    function setGraphModeOnForm(x, y) {
        $(".graph_point_info").val("true");
        $("input[type='radio']").prop("checked", false);
        $("#graph-y").val(y);
        $("#x-input").val(x);
    }

    function setInputModeOnForm() {
        $(".graph_point_info").val("false");
    }

    function getXYCoordsFromAbsoluteOffset(absoluteXOffset, absoluteYOffset, r) {
        const CENTER_X = 150;
        const CENTER_Y = 120;
        return {
            x: Math.round(((absoluteXOffset - CENTER_X) * r / 100) * 1000) / 1000,
            y: Math.round(((CENTER_Y - absoluteYOffset) * r / 100) * 1000) / 1000
        }
    }

    function getAbsoluteOffsetFromXYCoords(x, y, r) {
        const CENTER_X = 150;
        const CENTER_Y = 120;
        let relativeX = x * 100 / r;
        let relativeY = y * 100 / r;
        return {
            absoluteX: CENTER_X + Math.round(relativeX),
            absoluteY: CENTER_Y - Math.round(relativeY)
        }
    }

    function redrawDotsAfterRChanged() {
        document.querySelectorAll("circle.prev-dot").forEach(e => e.remove());
        let x, y, r, rNew, fill;
        let svg = document.getElementById("graph-svg");
        $("#result-table tbody tr").each(function (index, row) {
            x = parseFloat(row.cells[0].innerText);
            y = parseFloat(row.cells[1].innerText);
            r = parseFloat(row.cells[2].innerText);
            rNew = getR();
            fill = (r === rNew) ? "#ffd200" : "#3a3e40";
            let {absoluteX, absoluteY} = getAbsoluteOffsetFromXYCoords(x, y, rNew);
            svg.insertAdjacentHTML('beforeend', `<circle r="3" cx=${absoluteX} cy=${absoluteY} class="prev-dot" fill=${fill}></circle>`)
        });
    }

    function displayMessage(message) {
        document.getElementById("message-block").classList.remove("disappearing");
        document.getElementById("info-span").innerHTML = message;
        setTimeout(() => document.getElementById("message-block").classList.add("disappearing"), 0);
    }

    $("button.reset").on("click", function () {
        $(".clear_info").val("true");
    });

    $("#values-form").on("submit", function (event) {
        if (event.target.getAttribute("class").indexOf("reset") === -1 && !validateData()) event.preventDefault();
    });

    $(".svg-graph").on("click", function (event) {

        if (!validateR()) {
            displayMessage("R is not set, point cannot be drawn");
            return;
        }

        let graph = document.getElementById("graph-svg");
        let boundingRect = graph.getBoundingClientRect();
        let body = document.body;

        let dx = Math.round((event.pageX - (boundingRect.left + body.scrollLeft)) * 100) / 100;
        let dy = Math.round((event.pageY - (boundingRect.top + body.scrollTop)) * 100) / 100;
        let r = getR();
        drawDotInAbsoluteCoord($("#dot"), dx, dy);

        let {x, y} = getXYCoordsFromAbsoluteOffset(dx, dy, r);
        setGraphModeOnForm(x, y);

        if (validateData()) {
            sendRequestWithArgs();
        }
    });


    $("#r-options").on("change", function () {
        drawDot($("#dot"), getX(), getY(), getR());
        redrawDotsAfterRChanged();
    });

    $("#x-input").on("keypress", function (event) {
        let test = /[0-9.,\-+]/.test(event.key);
        if (!test) {
            event.preventDefault();
        }
    });

    $("#x-input").on("input", function () {
        drawDot($("#dot"), getX(), getY(), getR());
    });

    $("#yradio").on("change", function () {
        setInputModeOnForm();
        drawDot($("#dot"), getX(), getY(), getR());
    })

    $("button.submit").on("click", function (event) {
        event.preventDefault();

        if (validateData()) {
            sendRequestWithArgs();
        }
    });

    $("button.reset").on("click", function (event) {
        event.preventDefault();

        sendClearRequest();
    });

    function sendRequestWithArgs() {
        $.ajax({
            type: 'GET',
            url: 'controller',
            data: {
                'x': getX().toString(),
                'y': getY().toString(),
                'r': getR().toString(),
                'graph': $(".graph_point_info").val(),
                'graphY': getY(),
            },
            success: function () {
                window.location.href = '/web2-0/index.jsp';
            },
            error: function () {
                alert("Problem occured");
            }
        });
    }

    function sendClearRequest() {
        $.ajax({
            type: 'GET',
            url: 'controller',
            data: {
                "clear": "true"
            },
            success: function () {
                window.location.href = '/web2-0/index.jsp';
            },
            error: function () {
                alert("Problem occured");
            }
        });
    }

    let prevPointColor = "black";
    let curPointColor = "black";

    $("#result-table tbody tr").on("click", function () {
        let x = parseFloat(this.cells[0].innerText);
        let y = parseFloat(this.cells[1].innerText);
        let {absoluteX, absoluteY} = getAbsoluteOffsetFromXYCoords(x, y, getR());
        document.querySelectorAll("#graph-svg circle").forEach(function (circle, index) {
            if (parseFloat(circle.getAttribute("cx")) === absoluteX && parseFloat(circle.getAttribute("cy")) === absoluteY) {
                if (circle.getAttribute("fill") !== "#ea0037") curPointColor = circle.getAttribute("fill");
                circle.setAttribute("fill", "#ea0037");
            } else {
                if (circle.getAttribute("fill") === "#ea0037") {
                    circle.setAttribute("fill", prevPointColor);
                    prevPointColor = curPointColor;
                }
            }
        })
        prevPointColor = curPointColor;
    });

});

