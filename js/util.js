'use strict'

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function renderCell(pos, value) {
    document.querySelector(`.cell-${pos.i}-${pos.j}`).innerText = value
}

function clearIntervals(intervals) {
    for (var i = 0; i < intervals.length; i++) {
        clearInterval(intervals[i])
    }
}

function countTime() {
    var display = ''
    gGame.secsPassed++
        if (gGame.secsPassed > 60) {
            const seconds = ((gGame.secsPassed % 60) < 10) ? '0' + gGame.secsPassed % 60 : gGame.secsPassed % 60
            display = parseInt(gGame.secsPassed / 60) + ' : ' + seconds
        } else display = gGame.secsPassed
            // document.querySelector('.timer-display span').innerText = display
}

function getPos(elCell) {
    return { i: +elCell.dataset.pos[0], j: +elCell.dataset.pos[2] }
}

function getData(pos) {
    return `[data-pos="${pos.i}-${pos.j}"]`
}