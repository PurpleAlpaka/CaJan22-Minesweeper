'use strict'

function buildBoard(size) {
    var board = []
    var cellId = 0
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                cellId: ++cellId
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
            const onClick = (gGame.isManualMode) ? `markInput(this,${i},${j})` : 'cellClicked(this)'
            var className = (board[i][j].isShown) ? 'shown' : 'hidden'
            className += (board[i][j].isMarked) ? 'marked' : ''
            const currCellContents = (board[i][j].isShown) ? board[i][j].minesAroundCount : ''
            strHTMl += `<td data-i="${i}" data-j="${j}" class="cell ${className} ${gGame.currLvl.id}" onclick="${onClick}" 
            oncontextmenu="cellMarked(event)">${currCellContents}</td>`
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
        if (!gGame.isManualMode) addRandMines(gGame.currLvl.mines, pos)
        setMinesNegsCount(gBoard)
    }
    gGame.undoStates.boards.push(JSON.parse(JSON.stringify(gBoard)))
    gGame.undoStates.lives.push(gGame.remainingLives)
    if (gGame.isHintClick) {
        setTimeout(hideCells, 1000, gBoard, pos)
        gBoard[pos.i][pos.j].isShown = true
        showCell(elCell, pos)
        gGame.isHintClick = false
        return expandNegs(gBoard, pos, true)
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
    if (gGame.isHintClick) gGame.shownHintCells.push(pos)
    gGame.shownCount++
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
                var newColor = 'rgb(143, 10, 10)'
                break
            case 8:
                var newColor = 'rgb(65, 5, 5)'
                break
            default:
                var newColor = 'rgb(8, 131, 138)'
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
    gGame.markedCount += (gBoard[pos.i][pos.j].isMarked) ? 1 : -1

    ev.target.classList.toggle('marked')
    checkWin()
}

function expandNegs(board, pos, isHintClick) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === pos.i && j === pos.j) continue
            if (board[i][j].isShown) continue
            if (board[i][j].isMarked) continue
            if (board[i][j].isMine && !isHintClick) continue
            if (isHintClick) gGame.shownHintCells.push({ i, j })
            const elCurrCell = document.querySelector(getData({ i, j }))
            gBoard[pos.i][pos.j].isShown = true
            showCell(elCurrCell, { i, j })
            if (board[i][j].minesAroundCount !== 0) continue
            if (!isHintClick) expandNegs(board, { i, j })
        }
    }
}

function hideCells() {
    for (var i = 0; i < gGame.shownHintCells.length; i++) {
        const currPos = gGame.shownHintCells[i]
        gBoard[currPos.i][currPos.j].isShown = false
        const elCurrCell = document.querySelector(getData(currPos))
        elCurrCell.classList.remove('shown')
        elCurrCell.classList.add('hidden')
        elCurrCell.innerText = ''
        if (gBoard[currPos.i][currPos.j].isMine) elCurrCell.classList.remove('mine')
        gGame.shownCount--

    }
    // for (var i = pos.i - 1; i <= pos.i + 1; i++) {
    //     if (i < 0 || i > board.length - 1) continue
    //     for (var j = pos.j - 1; j <= pos.j + 1; j++) {
    //         if (j < 0 || j > board.length - 1) continue
    //         gGame.shownCount--
    //             gBoard[i][j].isShown = false
    //         const elCurrCell = document.querySelector(getData({ i, j }))
    //         elCurrCell.classList.remove('shown')
    //         elCurrCell.classList.add('hidden')
    //         elCurrCell.innerText = ''
    //         if (gBoard[i][j].isMine) elCurrCell.classList.remove('mine')
    //     }
    // }
}

function markInput(elCell, i, j) {
    if (gGame.manualMinesLeft <= 0 && !gBoard[i][j].isMine) return
    gBoard[i][j].isMine = !gBoard[i][j].isMine
    elCell.classList.toggle('mine')
    gGame.manualMinesLeft += (gBoard[i][j].isMine) ? -1 : 1
    document.querySelector('.mines-left span').innerText = gGame.manualMinesLeft
        // elCell.
}