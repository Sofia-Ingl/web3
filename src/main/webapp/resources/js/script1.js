$(document).ready(function () {

    const container = document.getElementById("clock-container");
    const re = /[0-9]{2}:[0-9]{2}:[0-9]{2}/;

    function updateTime() {
        let curr = new Date();
        let timeStr = curr.toTimeString();
        let ind = timeStr.search(re);
        let time = `<p class="huge-text">${timeStr.slice(ind, ind+8)}</p>`;
        let date = `<p>${curr.toDateString()}</p>`
        container.innerHTML = date + time;
    }

    updateTime();

    setInterval(updateTime, 1000);

});
