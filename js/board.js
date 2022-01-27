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
    gGame.lastShownCells = []
    if (gGame.isFirstClick) {
        gGame.isFirstClick = false
        gGame.intervals[0] = setInterval(countTime, 1000)
        addRandMines(gGame.currLvl.mines, pos)
        setMinesNegsCount(gBoard)
    }
    if (gGame.isHintClick) {
        setTimeout(hideCells, 1000, gGame.lastShownCells)
        gGame.isHintClick = false
    } else if (gBoard[pos.i][pos.j].isMine) {
        if (removeLife() <= 0) return gameOver(false)
        else {
            elCell.style.backgroundColor = 'red'
            setTimeout(() => {
                elCell.style.backgroundColor = ''
            }, 1000)
            return
        }
    }
    gBoard[pos.i][pos.j].isShown = true
    showCell(elCell, pos)
    if (!gBoard[pos.i][pos.j].minesAroundCount) expandNegs(gBoard, pos)
    if (checkWin()) gameOver(true)
}

function showCell(elCell, pos) {
    gGame.shownCount++
        gGame.lastShownCells.push(pos)
    gBoard[pos.i][pos.j].isShown = true
    elCell.classList.remove('hidden')
    elCell.classList.add('shown')
    elCell.innerText = (gBoard[pos.i][pos.j].minesAroundCount) ? gBoard[pos.i][pos.j].minesAroundCount : ''
    if (gBoard[pos.i][pos.j].isMine) {
        elCell.classList.add('mine')
    } else {
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
}

function cellMarked(ev) {
    ev.preventDefault()
    const pos = getPos(ev.target)
    if (!gGame.isOn || gBoard[pos.i][pos.j].isShown) return
    if (gGame.isFirstClick) {
        gGame.isFirstClick = false
        gGame.intervals[0] = setInterval(countTime, 1000)
    }
    gBoard[pos.i][pos.j].isMarked = !gBoard[pos.i][pos.j].isMarked
    gGame.markedCount++
        console.log('gGame.markedCount', gGame.markedCount)

    ev.target.classList.toggle('marked')
    checkWin()
}

var count = 0

function expandNegs(board, pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === pos.i && j === pos.j) continue
            if (board[i][j].isShown) continue
            if (board[i][j].isMarked) continue
            if (board[i][j].isMine) continue
            const elCurrCell = document.querySelector(getData({ i, j }))
            gBoard[pos.i][pos.j].isShown = true
            showCell(elCurrCell, { i, j })
            if (board[i][j].minesAroundCount !== 0) continue
            expandNegs(board, { i, j })
        }
    }
}

function hideCells(cells) {
    console.log('cells', cells)
    for (var i = 0; i < cells.length; i++) {
        const elCurrCell = document.querySelector(getData(cells[i]))
        elCurrCell.classList.remove('shown')
        elCurrCell.classList.add('hidden')
        elCurrCell.innerText = ''
        gGame.shownCount--
            gBoard[cells[i].i][cells[i].j].isShown = false
        if (gBoard[cells[i].i][cells[i].j].isMine) {
            elCurrCell.classList.remove('mine')
        }
    }
}