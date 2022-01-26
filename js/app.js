'use strict'

const MINE_IMG = 'M'
const LEVELS = [{ id: 'easy', size: 4, mines: 1 }, { id: 'medium', size: 8, mines: 12 }, { id: 'hard', size: 12, mines: 30 }]
var gBoard
var gGame = {
    isOn: false,
    isFirstClick: null,
    currLvl: LEVELS[0],
    prevCheckedBox: null,
    minePositions: [],
    intervals: [], // [0] = timerInterval
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    shownTarget: 0,
    remainingLives: 0
}

function initGame() {
    gGame.isOn = true
    gGame.isFirstClick = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gGame.shownTarget = (gGame.currLvl.size ** 2) - gGame.currLvl.mines
    gGame.prevCheckedBox = document.getElementById(gGame.currLvl.id)
    gGame.prevCheckedBox.checked = true
    gGame.remainingLives = 3
    clearIntervals(gGame.intervals)
    gGame.intervals = []
    gBoard = buildBoard(gGame.currLvl.size)
    renderBoard(gBoard)
    document.querySelector('.time').innerText = '0'
    document.querySelector('.modal').style.display = 'none'
}

function checkWin() {
    console.log('gGame.shownTarget', gGame.shownTarget)
    console.log('gGame.shownCount', gGame.shownCount)
    if (gGame.shownCount !== gGame.shownTarget) return false
    for (var i = 0; i < gGame.minePositions.length; i++) {
        const currPos = gGame.minePositions[i]
        console.log('currPos', currPos)
        if (!gBoard[currPos.i][currPos.j].isMarked) return false
    }
    gameOver(true)
}

function gameOver(isWin) {
    var winText
    gGame.isOn = false
    clearIntervals(gGame.intervals)
    if (!isWin) {
        winText = 'lost...'
        showAllMines(gBoard)
    } else winText = 'won!'
    document.querySelector('.win-text').innerText = winText
    document.querySelector('.modal').style.display = 'block'
}

function handleKey(ev) {
    const validCodes = ['KeyR', 'Escape']
    var isValidCode = false
    for (var i = 0; i < validCodes.length; i++) {
        if (ev.code === validCodes[i]) {
            isValidCode = true
            break
        }
    }
    if (!isValidCode) return
    switch (ev.code) {
        case 'KeyR':
            initGame()
            break
        case 'Escape':
            document.querySelector('.modal').style.display = 'none'
            break
    }
}

function changeLvl(lvlIdx) {
    gGame.prevCheckedBox.checked = false
    gGame.currLvl = LEVELS[lvlIdx]
    initGame()
}

function removeLife() {
    console.log('gGame.remainingLives', gGame.remainingLives)

    document.querySelector(`.life-${gGame.remainingLives}`).backgroundImage = ('url(../assets/deadHeart.png)')
    return --gGame.remainingLives
}