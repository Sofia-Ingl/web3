$(document).ready(function () {

    const MAX_X = 5;
    const MIN_X = -5;
    const MAX_Y = 3;
    const MIN_Y = -3;


    let rValue;
    let yValue;
    let xValue;

    let dot = document.getElementById("dot");
    let prevPointColor = "black";
    let curPointColor = "black";

    const curPointFill = "#ffd200";
    const curPointsFillHit = 'red';
    const prevPointFill = "#3a3e40"


    let svg = document.getElementById("graph-svg");


    function rectangle(x, y, r) {
        return x>=-r && x<=0 && y>=-r/2 && y<=0;
    }

    function triangle(x, y, r) {
        return x>=0 && y<=0 && y>=x/2 - r/2;
    }

    function circle(x, y, r) {
        return x<=0 && y>=0 && (x*x + y*y <= r*r/4);
    }

    function checkIfHit(x, y, r) {
        return rectangle(x, y, r) || triangle(x, y, r) || circle(x, y, r);
    }

    // function getXmlHttpReq() {
    //     let req = null;
    //     try {
    //
    //         if (window.XMLHttpRequest) {
    //             req = new XMLHttpRequest();
    //         } else {
    //             if (window.ActiveXObject) {
    //                 try {
    //                     req = new ActiveXObject("Msxml2.XMLHTTP");
    //                 } catch (e) {
    //                     req = new ActiveXObject("Microsoft.XMLHTTP");
    //                 }
    //             }
    //         }
    //
    //     } catch (ex) {
    //     }
    //     return req;
    // }
    //
    //
    // function sendRequestAndRenewDynamicParts() {
    //     let req = getXmlHttpReq();
    //
    //     let x = getX();
    //     let y = getY();
    //     let r = getR();
    //     let svg = document.getElementById("graph-svg");
    //     let url = 'controller?' + 'x=' + x.toString() +
    //         '&y=' + y.toString() +
    //         '&r=' + r.toString() +
    //         '&graph=' + document.querySelector(".graph_point_info").value +
    //         '&graphY=' + y.toString() +
    //         '&table=true';
    //
    //     req.open("GET", url, true);
    //
    //     req.setRequestHeader("X-Inc-Counter", r.toString());
    //
    //     req.addEventListener("readystatechange", () => {
    //         try {
    //             if (req.readyState === 4 && req.status === 200) {
    //
    //                 document.getElementById("table-scroll-container").innerHTML = req.response;
    //                 let {absoluteX, absoluteY} = getAbsoluteOffsetFromXYCoords(x, y, r);
    //                 addTableRowEventListeners();
    //                 redrawDotsAfterRChanged();
    //
    //             }
    //         } catch (e) {
    //             alert("Error occurred: " + e);
    //         }
    //     });
    //     req.send();
    // }
    //
    //
    // function sendClearHttpRequest() {
    //     let paramString = 'clear=true';
    //     let req = getXmlHttpReq();
    //     let url = 'controller?' + paramString;
    //     req.open("GET", url, true);
    //
    //     req.addEventListener("readystatechange", () => {
    //         try {
    //             if (req.readyState === 4 && req.status === 200) {
    //
    //                 document.querySelectorAll("circle.prev-dot").forEach(function (obj) {
    //                     obj.remove();
    //                 });
    //                 document.getElementById("table-scroll-container").innerHTML = "";
    //
    //             }
    //         } catch (e) {
    //             alert("Error occurred: " + e);
    //         }
    //     });
    //     req.send();
    // }


    function isNumber(number) {
        return !isNaN(number) && isFinite(number);
    }

    function validateX() {
        let x = getX();
        if (isNumber(x) && x >= MIN_X && x <= MAX_X) {
            return true;
        }
        return false;
    }

    function validateY() {
        let y = getY();
        if (isNumber(y) && y >= MIN_Y && y <= MAX_Y) {
            return true;
        }
        return false;

    }

    function validateR() {
        let r = getR();
        return isNumber(r);
    }

    function validateData() {
        let valid = validateX() && validateY() && validateR();
        if (!valid) displayMessage("Data is invalid, please check restrictions (current X value is " + getX() + "; current Y value is " + getY() + "; current R value is " + getR() + ")");
        return validateX() && validateY() && validateR();
    }

    function getY() {

        let y = document.querySelector(".y-input-field").value;
        if (typeof y != "undefined") {
            y = y.replace(",", ".");
            if (/^[+-]?[0-9]+\.?[0-9]*$/.test(y)) {
                return parseFloat(y);
            }
        }

        return NaN;
    }

    function getX() {
        let x = document.querySelector(".x-input-field").value;
        if (typeof x != "undefined") {
            x = x.replace(",", ".");
            if (/^[+-]?[0-9]+\.?[0-9]*$/.test(x)) {
                return parseFloat(x);
            }
        }
        return NaN;

    }

    function getR() {
        //let r = parseFloat(document.querySelector('.hidden_r input[type="hidden"]').value);
        //alert(document.querySelector('.hidden_r input[type="hidden"]').value);
        let r = rValue;
        if (!isNaN(r) && r > 0) return r;
        return NaN;
    }


    function drawDot(x, y, r) {
        if (isNumber(x) && isNumber(y) && isNumber(r)) {
            let {absoluteX, absoluteY} = getAbsoluteOffsetFromXYCoords(x, y, r);
            drawDotInAbsoluteCoord(absoluteX, absoluteY);

        } else {
            dot.setAttribute("r", 0);
        }
    }

    function drawDotInAbsoluteCoord(absoluteX, absoluteY) {
        dot.setAttribute("r", 3);
        dot.setAttribute("cx", absoluteX);
        dot.setAttribute("cy", absoluteY);
    }

    // function setGraphModeOnForm(x, y) {
    //     document.querySelector(".graph_point_info").value = "true";
    //     if (document.querySelector("input[type='radio']:checked") != null) {
    //         document.querySelector("input[type='radio']:checked").checked = false;
    //     }
    //     document.querySelector("#graph-y").value = y;
    //     document.querySelector("#x-input").value = x;
    // }
    //
    // function setInputModeOnForm() {
    //     document.querySelector(".graph_point_info").value = "false";
    // }
    //
    function getXYCoordsFromAbsoluteOffset(absoluteXOffset, absoluteYOffset, r) {
        const CENTER_X = 150;
        const CENTER_Y = 120;
        return {
            x: Math.round(((absoluteXOffset - CENTER_X) * r / 100) * 1000) / 1000,
            y: Math.round(((CENTER_Y - absoluteYOffset) * r / 100) * 1000) / 1000
        }
    }

    //
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

    //
    function redrawDotsAfterRChanged() {
        document.querySelectorAll("circle.prev-dot").forEach(e => e.remove());
        let x, y, r, rNew, fill, hit;
        document.querySelectorAll("#result-table tbody tr").forEach(function (row, index) {
            x = parseFloat(row.cells[0].innerText);
            y = parseFloat(row.cells[1].innerText);
            r = parseFloat(row.cells[2].innerText);
            hit = row.cells[3].innerText;
            rNew = getR();
            if (r === rNew) {
                fill = (hit === 'true') ? curPointsFillHit : curPointFill;
            } else {
                fill = prevPointFill;
            }
            if (isNumber(rNew) && isNumber(x) && isNumber(y)) {
                drawTableDot(x, y, rNew, fill);
            }
        });
    }

    function drawTableDot(x, y, r, fill) {
        let {absoluteX, absoluteY} = getAbsoluteOffsetFromXYCoords(x, y, r);
        svg.insertAdjacentHTML('beforeend', `<circle r="3" cx=${absoluteX} cy=${absoluteY} class="prev-dot" fill=${fill}></circle>`)

    }

    //
    function displayMessage(message) {
        document.getElementById("message-block").classList.remove("disappearing");
        setTimeout(() => document.getElementById("message-block").classList.add("disappearing"), 0);
        document.getElementById("info-span").innerHTML = message;
    }

    //
    // function rowListener() {
    //     let x = parseFloat(this.cells[0].innerText);
    //     let y = parseFloat(this.cells[1].innerText);
    //     let {absoluteX, absoluteY} = getAbsoluteOffsetFromXYCoords(x, y, getR());
    //     document.querySelectorAll("#graph-svg circle").forEach(function (circle, index) {
    //         if (parseFloat(circle.getAttribute("cx")) === absoluteX && parseFloat(circle.getAttribute("cy")) === absoluteY) {
    //             if (circle.getAttribute("fill") !== "#ea0037") curPointColor = circle.getAttribute("fill");
    //             circle.setAttribute("fill", "#ea0037");
    //         } else {
    //             if (circle.getAttribute("fill") === "#ea0037") {
    //                 circle.setAttribute("fill", prevPointColor);
    //                 prevPointColor = curPointColor;
    //             }
    //         }
    //     })
    //     prevPointColor = curPointColor;
    // }
    //
    function graphListener(event) {

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
        drawDotInAbsoluteCoord(dx, dy);

        let {x, y} = getXYCoordsFromAbsoluteOffset(dx, dy, r);
        //setGraphModeOnForm(x, y);

        document.querySelector(".y-input-field").value = y;
        yValue = y;
        document.querySelector(".x-input-field").value = x;

        let ySliderPercent = (y + 3) / 6 * 100;
        ySliderPercent = (ySliderPercent < 0) ? 0 : ySliderPercent;
        ySliderPercent = (ySliderPercent > 100) ? 100 : ySliderPercent;

        document.querySelector(".ui-slider-range").setAttribute("style", "width:" + ySliderPercent + "%");
        document.querySelector(".ui-slider-handle").setAttribute("style", "left:" + ySliderPercent + "%");

        if (validateData()) {
            prepareHiddenFields();
            document.querySelector(".main-button.submit").click();
            //drawTableDot(xValue, yValue, rValue, curPointFill);
            //redrawDotsAfterRChanged();
        }
    }


    document.querySelector(".main-button.reset").addEventListener("click", function () {
        document.querySelectorAll("circle.prev-dot").forEach(function (obj) {
            obj.remove();
        });
        document.querySelector("#table-scroll-container tbody").innerHTML = "";
    });


    document.querySelector(".svg-graph").addEventListener("click", graphListener);
    //
    // function addTableRowEventListeners() {
    //     document.querySelectorAll("#result-table tbody tr").forEach(function (row) {
    //         row.addEventListener("click", rowListener);
    //     });
    // }
    //
    // addTableRowEventListeners();
    //
    // document.querySelector("#r-options").addEventListener("change", function () {
    //     drawDot(getX(), getY(), getR());
    //     redrawDotsAfterRChanged();
    // });
    //
    document.querySelector(".x-input-field").addEventListener("keypress", function (event) {
        let test = /[0-9.,\-+]/.test(event.key);
        if (!test) {
            event.preventDefault();
        }
    });

    document.querySelector(".x-input-field").addEventListener("input", function () {
        drawDot(getX(), getY(), getR());
    });


    // document.querySelector(".ui-slider-handle").addEventListener("dragend", function () {
    //     alert("WEE");
    //     drawDot(getX(), getY(), getR());
    // });

    // document.querySelector(".r-input-field").addEventListener("change", function () {
    //     drawDot(getX(), getY(), getR());
    // });


    document.querySelectorAll(".r-grid a").forEach(function (obj) {
        obj.addEventListener("click", function () {

            rValue = parseFloat(this.innerText);

            changeROnAxes();
            // document.querySelectorAll(".coor-text").forEach(function (text) {
            //
            //     let valInGraph;
            //     let classList = text.classList;
            //     if (classList.contains("neg")) {
            //         if (classList.contains("div")) {
            //             valInGraph = -rValue / 2;
            //         } else {
            //             valInGraph = -rValue;
            //         }
            //     } else {
            //         if (classList.contains("div")) {
            //             valInGraph = rValue / 2;
            //         } else {
            //             valInGraph = rValue;
            //         }
            //     }
            //     text.innerHTML = Math.round(valInGraph * 100) / 100;
            //
            // });

            redrawDotsAfterRChanged();
            drawDot(getX(), getY(), getR());

        })
    });

    function changeROnAxes() {
        document.querySelectorAll(".coor-text").forEach(function (text) {

            let valInGraph;
            let classList = text.classList;
            if (classList.contains("neg")) {
                if (classList.contains("div")) {
                    valInGraph = -rValue / 2;
                } else {
                    valInGraph = -rValue;
                }
            } else {
                if (classList.contains("div")) {
                    valInGraph = rValue / 2;
                } else {
                    valInGraph = rValue;
                }
            }
            text.innerHTML = Math.round(valInGraph * 100) / 100;

        });
    }


    function prepareHiddenFields() {
        yValue = parseFloat($('.y-input-field').val());
        xValue = parseFloat($('.x-input-field').val());
        if (isNumber(rValue) && isNumber(yValue) && isNumber(xValue)) {
            $('.hidden_r input[type="hidden"]').val(rValue);
            $('.hidden_y input[type="hidden"]').val(yValue);
            $('.hidden_x input[type="hidden"]').val(xValue);
        } else {
            $('.hidden_r input[type="hidden"]').val(null);
            $('.hidden_y input[type="hidden"]').val(null);
            $('.hidden_x input[type="hidden"]').val(null);
        }
    }
    document.querySelector(".main-button.submit").addEventListener("mousedown", function (event) {
        prepareHiddenFields();
    });

    document.querySelector(".main-button.submit").addEventListener("click", function (event) {
        if (!validateData()) {
            event.preventDefault();
        } else {
            // ЦВЕТАААААААААААААА
            let x, y, r;
            x = getX();
            y = getY();
            r = getR();
            let fill = (checkIfHit(x, y, r)) ? curPointsFillHit : curPointFill;
            drawTableDot(x, y, r, fill);
        }
    });

    function restoreR() {
        let table = document.getElementById("result-table");
        let row = table.rows[table.rows.length - 1];
        rValue = parseFloat(row.cells[2].innerText);
        if (isNumber(rValue)&& rValue>0) {
            changeROnAxes();
            redrawDotsAfterRChanged();
            drawDot(getX(), getY(), getR());
        }
    }
    
    // function submitEventHandler(data) {
    //     let status = data.status;
    //     if (status === "success") {
    //         let x, y, r;
    //         x = getX();
    //         y = getY();
    //         r = getR();
    //         let fill = (checkIfHit(x, y, r)) ? curPointsFillHit : curPointFill;
    //         drawTableDot(x, y, r, fill);
    //     }
    // }


    restoreR();


});