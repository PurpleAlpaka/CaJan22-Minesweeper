'use strict'

function addRandMines(minesCount, clickPos) {
    if (minesCount <= 0) return
    const randPos = {
        i: getRandomInt(0, gBoard.length),
        j: getRandomInt(0, gBoard[0].length)
    }
    if (randPos.i === clickPos.i && randPos.j === clickPos.j ||
        gBoard[randPos.i][randPos.j].isMine) addRandMines(minesCount, clickPos)
    else if (gBoard) {
        gBoard[randPos.i][randPos.j].isMine = true
        addRandMines(--minesCount, clickPos)
    }
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isMine) continue
            board[i][j].minesAroundCount = countMinesAround(board, { i, j })
        }
    }
}

function countMinesAround(board, pos) {
    var count = 0
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > board.length - 1 ||
                (i === pos.i && j === pos.j)) continue
            if (board[i][j].isMine) count++
        }
    }
    return count
}