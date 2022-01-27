'use strict'
// TODO: Fix manual position of mines - limit number of mines that can be placed and display the remaining amount
// TODO: make leaderboard dynamic and show all scores in order
// TODO: Oragnize upper, oragnize features, make page look good
// TODO: Make a flickerClass() func and refactor accordingly
// TODO: Reduce / Oragnize gGame and initilaztion
// TODO: Show helps used in game over modal
// TODO: Easter Egg
// TODO: HARDCORE MODE: No helps allowed, 1 life

// I'm sick AF, I know this looks like trash design wise but I don't have the energy, I hope to make it look good soon
const MINE_IMG = 'M'
const LEVELS = [{ id: 'easy', size: 4, mines: 2 }, { id: 'medium', size: 8, mines: 1 }, { id: 'hard', size: 12, mines: 1 }]
const DEAFULT_SMILEY = '🐴'
const HAPPY_SMILEY = '🦄'
const DEAD_SMILEY = '☠️'

// var gBestScores = { easy: [], medium: [], hard: [] }
var gBoard
var gGame = {
    isOn: false,
    isManualMode: false,
    isFirstClick: null,
    currLvl: LEVELS[0],
    prevCheckedBox: null,
    intervals: [], // [0] = timerInterval
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    shownTarget: 0,
    remainingLives: 0,
    isHintClick: null,
    safeClicksLeft: 0,
    undoStates: [],
    is7Boom: false
}

function initGame() {
    gGame.isOn = true
    gGame.isFirstClick = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gGame.shownTarget = (gGame.currLvl.size ** 2) - gGame.currLvl.mines
    gGame.shownCount = 0
    gGame.prevCheckedBox = document.getElementById(gGame.currLvl.id)
    gGame.prevCheckedBox.checked = true
    gGame.remainingLives = 3
    gGame.isHintClick = false
    gGame.safeClicksLeft = 3
    gGame.undoStates = []
    clearIntervals(gGame.intervals)
    gGame.intervals = []
    document.querySelector('.time').innerText = '0'
    document.querySelector('.modal').style.display = 'none'
    document.querySelector('.smiley').innerText = DEAFULT_SMILEY
    document.querySelector('.safe-click span').innerText = gGame.safeClicksLeft
    const elLives = document.querySelectorAll('.lives span')
    for (var i = 0; i < elLives.length; i++) {
        elLives[i].style.backgroundImage = 'url(../assets/heart.png)'
    }
    const elHints = document.querySelectorAll('.hints span')
    for (var i = 0; i < elHints.length; i++) {
        elHints[i].style.backgroundImage = 'url(../assets/hint.png)'
        elHints[i].addEventListener('click', useHint, 'this.target')
    }
    gBoard = buildBoard(gGame.currLvl.size)
    renderBoard(gBoard)
}

function checkWin() {
    if (gGame.shownCount !== gGame.shownTarget || gGame.currLvl.mines !== gGame.markedCount) return false

    gameOver(true)
}

function startManualMode() {
    gGame.isManualMode = false
    renderBoard(gBoard)
    gGame.isManualMode = true
    document.querySelector('.start-game').style.display = 'none'
}

function gameOver(isWin) {
    var winText
    var currSmiley
    gGame.isOn = false
    clearIntervals(gGame.intervals)
    if (!isWin) {
        winText = 'lost...'
        showAllMines(gBoard)
        currSmiley = DEAD_SMILEY
    } else {
        winText = 'won!'
        currSmiley = HAPPY_SMILEY
        setHighScores(gGame.secsPassed, gGame.currLvl.id)
    }
    document.querySelector('.smiley').innerText = currSmiley
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
    if (lvlIdx !== 3 && lvlIdx !== 4) {
        gGame.prevCheckedBox.checked = false
        gGame.currLvl = LEVELS[lvlIdx]
    } else if (lvlIdx === 3) {
        gGame.isManualMode = !gGame.isManualMode
        if (gGame.isManualMode) document.querySelector('.start-game').style.display = 'block'
    } else gGame.is7Boom = true
    initGame()
}

function removeLife() {
    document.querySelector(`.life-${gGame.remainingLives}`).style.backgroundImage = ('url(../assets/deadHeart.png)')
    return --gGame.remainingLives
}

function useHint(elHint) {
    if (gGame.isHintClick) return
    elHint.target.onclick = ''
    elHint.target.style.backgroundImage = 'url(../assets/hintOff.png)'
    gGame.isHintClick = true
}

function setHighScores(secsPassed, diff) {
    console.log('localStorage.getItem(diff)', localStorage.getItem(diff))

    if (secsPassed < localStorage.getItem(diff) || !localStorage.getItem(diff)) localStorage[diff] = secsPassed
    document.querySelector(`.leaderboard .${diff} span`).innerText = localStorage[diff]
        // gBestScores[diff].push(secsPassed)
        // gBestScores[diff].sort()
        // localStorage[diff] = gBestScores[diff].join(',')
        // document.querySelector(`.leaderboard .${diff}`).innerText = localStorage[diff]
}

// function showLeader(diff) {
//     console.log('document.querySelector(`.leaderboard .${diff}`)', document.querySelector(`.leaderboard .${diff}`))

//     document.querySelector(`.leaderboard .${diff}`).style.display = 'block'
// }

function showSafeClick(elBtn) {
    if (gGame.safeClicksLeft <= 0) return
    gGame.safeClicksLeft--
        elBtn.querySelector('span').innerText = gGame.safeClicksLeft
    var safeClicks = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (!gBoard[i][j].isMarked && !gBoard[i][j].isShown &&
                !gBoard[i][j].isMine) safeClicks.push({ i, j })
        }
    }
    const safeClick = safeClicks[getRandomInt(0, safeClicks.length)]
    document.querySelector(getData(safeClick)).style.backgroundColor = 'green'
    setTimeout(() => { document.querySelector(getData(safeClick)).style.backgroundColor = '' }, 3000)
}

function undo() {
    if (!gGame.undoStates) return
    gBoard = gGame.undoStates.pop()
    renderBoard(gBoard)
}