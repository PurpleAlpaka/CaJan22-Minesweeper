'use strict'

const MINE_IMG = 'M'
const LEVELS = [{ id: 'easy', size: 4, mines: 2 }, { id: 'medium', size: 8, mines: 12 }, { id: 'hard', size: 12, mines: 30 }]
var gBoard
var gGame = {
    isOn: false,
    currLvl: LEVELS[0],
    prevCheckedBox: null,
    minePositions: [{ i: 0, j: 0 }, { i: 1, j: 0 }],
    intervals: [], // [0] = timerInterval
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    shownTarget: 0
}

function initGame() {
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gGame.shownTarget = (gGame.currLvl.size ** 2) - gGame.currLvl.mines
    gGame.prevCheckedBox = document.getElementById(gGame.currLvl.id)
    gGame.prevCheckedBox.checked = true
    clearIntervals(gGame.intervals)
    gGame.intervals = []
    gBoard = buildBoard(gGame.currLvl.size)
    setRandomMines(gGame.currLvl.mines)
    console.log('gBoard', gBoard)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
}

function checkWin() {
    if (gGame.shownCount !== gGame.shownTarget) return false
    for (var i = 0; i < gGame.minePositions.length; i++) {
        const currPos = gGame.minePositions[i]
        if (!gBoard[currPos.i][currPos.j].isMarked) return false
    }
    return true
}

function gameOver(isWin) {
    gGame.isOn = false
        // console.log('isWin', isWin)
    if (!isWin) {
        // showAllMines()
    } else console.log('isWin', isWin)

}

function handleKey(ev) {
    if (ev.code !== 'KeyR') return
    initGame()
}

function changeLvl(lvlIdx) {
    gGame.prevCheckedBox.checked = false
    gGame.currLvl = LEVELS[lvlIdx]
    initGame()
}