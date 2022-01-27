'use strict'
// TODO: Safe Click
// TODO: Manual position of mines
// TODO: Undo
// TODO: 7 BOOM
// TODO: make leaderboard dynamic and show all scores in order
// TODO: prettify
// TODO: Make a flickerClass() func and refactor accordingly
// TODO: Reduce / Oragnize gGame and initilaztion
// TODO: Show helps used in game over modal
// TODO: Easter Egg
// TODO: HARDCORE MODE: No helps allowed, 1 life

const MINE_IMG = 'M'
const LEVELS = [{ id: 'easy', size: 4, mines: 1 }, { id: 'medium', size: 8, mines: 1 }, { id: 'hard', size: 12, mines: 1 }]
const DEAFULT_SMILEY = '🐴'
const HAPPY_SMILEY = '🦄'
const DEAD_SMILEY = '☠️'

// var gBestScores = { easy: [], medium: [], hard: [] }
var gBoard
var gGame = {
    isOn: false,
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
    safeClicksLeft: 0
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
    clearIntervals(gGame.intervals)
    gGame.intervals = []
    gBoard = buildBoard(gGame.currLvl.size)
    renderBoard(gBoard)
    document.querySelector('.time').innerText = '0'
    document.querySelector('.modal').style.display = 'none'
    document.querySelector('.smiley').innerText = DEAFULT_SMILEY
    const elLives = document.querySelectorAll('.lives span')
    for (var i = 0; i < elLives.length; i++) {
        elLives[i].style.backgroundImage = 'url(../assets/heart.png)'
    }
    const elHints = document.querySelectorAll('.hints span')
    for (var i = 0; i < elHints.length; i++) {
        elHints[i].style.backgroundImage = 'url(../assets/hint.png)'
        elHints[i].addEventListener('click', useHint, 'this.target')
    }
}

function checkWin() {
    if (gGame.shownCount !== gGame.shownTarget || gGame.currLvl.mines !== gGame.markedCount) return false

    gameOver(true)
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
    gGame.prevCheckedBox.checked = false
    gGame.currLvl = LEVELS[lvlIdx]
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

function showSafeClick() {
    if (gGame.safeClicksLeft <= 0) return
    var safeClicks = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (!gBoard[i][j].isMarked && !gBoard[i][j].isShown &&
                !gBoard[i][j].isMine) safeClicks.push({ i, j })
        }
    }
    const safeClick = safeClicks[getRandomInt(0, safeClicks.length)]
    document.querySelector()
}