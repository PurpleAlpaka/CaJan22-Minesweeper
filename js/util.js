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

function countMinesAround(board, pos) {
    var count = 0
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > board.length - 1 ||
                (i === pos.i && j === pos.j)) continue
            if (!board[i][j].isMine) count++
        }
    }
    return count
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
    return { i: elCell.dataset.pos[0], j: elCell.dataset.pos[2] }
}