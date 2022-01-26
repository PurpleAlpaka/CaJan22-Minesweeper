'use strict'

function buildBoard(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board
}

function setRandomMines(minesCount) {
    for (var i = 0; i < minesCount; i++) {
        gBoard[getRandomInt(0, gBoard.length - 1)][getRandomInt(0, gBoard[0].length - 1)].isMine = true
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

function renderBoard(board) {
    var strHTMl = ``
    for (var i = 0; i < board.length; i++) {
        strHTMl += `<tr>`
        for (var j = 0; j < board.length; j++) {
            const pos = { i, j }
            strHTMl += `<td data-pos="${i}-${j}" class="cell hidden" onclick="cellClicked(this,${i},${j})" 
            oncontextmenu="cellMarked(event)"></td>`
        }
        strHTMl += `</tr>`
    }
    document.querySelector('.board').innerHTML = strHTMl
}

function cellClicked(elCell) {
    const pos = getPos(elCell)
    if (!gGame.isOn || gBoard[pos.i][pos.j].isShown || gBoard[pos.i][pos.j].isMarked) return
    if (gGame.isFirstClick) {
        gGame.isFirstClick = false
        gGame.intervals[0] = setInterval(countTime, 1000)
    }

    gBoard[pos.i][pos.j].isShown = true

    if (gBoard[pos.i][pos.j].isMine) {
        elCell.classList.add('mine')
        gameOver(false)
    }

    elCell.classList.remove('hidden')
    elCell.classList.add('shown')
    elCell.innerText = (gBoard[pos.i][pos.j].minesAroundCount) ? gBoard[pos.i][pos.j].minesAroundCount : ''
    gGame.shownCount++
        if (checkWin()) gameOver(true)
}

function cellMarked(ev) {
    ev.preventDefault()
    const pos = getPos(ev.target)
    if (!gGame.isOn || gBoard[pos.i][pos.j].isShown) return
    if (gGame.isFirstClick) {
        gGame.isFirstClick = false
        gGame.intervals[0] = setInterval(countTime, 1000)
    }
    gBoard[pos.i][pos.j].isMarked = true
    gGame.markedCount++
        ev.target.classList.toggle('marked')
    if (checkWin()) gameOver(true)
}