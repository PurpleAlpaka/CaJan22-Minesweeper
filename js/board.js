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

function renderBoard(board) {
    var strHTMl = ``
    for (var i = 0; i < board.length; i++) {
        strHTMl += `<tr>`
        for (var j = 0; j < board.length; j++) {
            const pos = { i, j }
            strHTMl += `<td data-i="${i}" data-j="${j}" class="cell hidden ${gGame.currLvl.id}" onclick="cellClicked(this)" 
            oncontextmenu="cellMarked(event)"></td>`
        }
        strHTMl += `</tr>`
    }
    document.querySelector('.board').innerHTML = strHTMl
}

function cellClicked(elCell) {
    const pos = getPos(elCell)
    console.log('getPos', pos)

    if (!gGame.isOn || gBoard[pos.i][pos.j].isShown || gBoard[pos.i][pos.j].isMarked) return
    if (gGame.isFirstClick) {
        gGame.isFirstClick = false
        console.log('gGame.isFirstClick', gGame.isFirstClick)

        gGame.intervals[0] = setInterval(countTime, 1000)
        addRandMines(gGame.currLvl.mines, pos)
        setMinesNegsCount(gBoard)
    } else if (gBoard[pos.i][pos.j].isMine) {
        elCell.classList.add('mine')
        return gameOver(false)
    }
    gBoard[pos.i][pos.j].isShown = true
    showCell(elCell, pos)
    if (!gBoard[pos.i][pos.j].minesAroundCount) expandNegs(gBoard, pos)
    gGame.shownCount++
        if (checkWin()) gameOver(true)
}

function showCell(elCell, pos) {
    elCell.classList.remove('hidden')
    elCell.classList.add('shown')
    elCell.innerText = (gBoard[pos.i][pos.j].minesAroundCount) ? gBoard[pos.i][pos.j].minesAroundCount : ''
    switch (gBoard[pos.i][pos.j].minesAroundCount) {
        case 3:
        case 4:
            var newColor = 'yellow'
            break
        case 4:
        case 5:
            var newColor = 'red'
        case 6:
        case 7:
            var newColor = rgb(143, 10, 10)
            break
        case 8:
            var newColor = rgb(65, 5, 5)
            break
        default:
            var newColor = '#043a3d'
            break
    }
    elCell.style.color = newColor
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

function expandNegs(board, pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > board.length - 1 ||
                (i === pos.i && j === pos.j) || board[i][j].isShown) continue
            const elCurrCell = document.querySelector(getData({ i, j }))
            gBoard[pos.i][pos.j].isShown = true
            showCell(elCurrCell, { i, j })
            if (board[i][j].minesAroundCount) continue
            expandNegs(board, { i, j })
        }
    }
}