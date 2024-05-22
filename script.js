let mintCount = 0;
const mintButton = document.getElementById('mint-button');
const mintCountDisplay = document.getElementById('mint-count');
const memoriesContainer = document.getElementById('memories');
const storeItems = document.querySelectorAll('.item');
const sashyUpgradesContainer = document.getElementById('sashy-upgrades');
const sashyUpgrades = document.querySelectorAll('.sashy-upgrade');
const sashyImage = document.getElementById('sashy-image');
const sashyTimer = document.getElementById('sashy-timer');
const sashyTimerEmoji = document.getElementById('sashy-timer-emoji');
const sashyTimerCountdown = document.getElementById('sashy-timer-countdown');
const factoryButton = document.getElementById('factory-button');
const factoryContainer = document.getElementById('factory-container');
const mintCubeButton = document.getElementById('mint-cube-button');
const mintCubeContainer = document.getElementById('mint-cube-container');
const mcCubeButton = document.getElementById('mc-cube-button');
const mcCubeContainer = document.getElementById('mc-cube-container');
const fuukaContainer = document.getElementById('fuuka-container');
const fuukaImage = document.getElementById('fuuka-image');
const l4d2Container = document.getElementById('l4d2-container');

let mcCubeClicks = 0;
let radioPlaying = false;
let autoMintIncrement = 0;
let clickMultiplier = 1;
let autoMintMultiplier = 1;
let sashySpeedMultiplier = 1;
let memoryCount = 0;

const radioAudio = new Audio('radio.mp3');
radioAudio.loop = true;

const memories = [
    { mintsRequired: 50, text: "Memory 1: A wonderful day at the park.", image: "path/to/image1.jpg", video: "path/to/video1.mp4", unlocked: false },
    { mintsRequired: 100, text: "Memory 2: Our trip to the beach.", image: "path/to/image2.jpg", video: "path/to/video2.mp4", unlocked: false },
    { mintsRequired: 150, text: "Memory 3: A special birthday celebration.", image: "path/to/image3.jpg", video: "path/to/video3.mp4", unlocked: false },
    { mintsRequired: 200, text: "Memory 4: Family reunion.", image: "path/to/image4.jpg", video: "path/to/video4.mp4", unlocked: false },
    { mintsRequired: 250, text: "Memory 5: Our first trip abroad.", image: "path/to/image5.jpg", video: "path/to/video5.mp4", unlocked: false },
    { mintsRequired: 300, text: "Memory 6: Fun at the amusement park.", image: "path/to/image6.jpg", video: "path/to/video6.mp4", unlocked: false },
    { mintsRequired: 350, text: "Memory 7: Our anniversary.", image: "path/to/image7.jpg", video: "path/to/video7.mp4", unlocked: false },
    { mintsRequired: 400, text: "Memory 8: Holiday celebration.", image: "path/to/image8.jpg", video: "path/to/video8.mp4", unlocked: false },
    { mintsRequired: 450, text: "Memory 9: Picnic in the park.", image: "path/to/image9.jpg", video: "path/to/video9.mp4", unlocked: false },
    { mintsRequired: 500, text: "Memory 10: New Year's Eve party.", image: "path/to/image10.jpg", video: "path/to/video10.mp4", unlocked: false }
];

mintButton.addEventListener('click', () => {
    mintCount += clickMultiplier;
    updateMintCount();
});

storeItems.forEach(item => {
    item.addEventListener('click', () => {
        const cost = parseInt(item.getAttribute('data-cost'));
        const type = item.getAttribute('data-type');

        if (mintCount >= cost) {
            mintCount -= cost;
            updateMintCount();

            if (type === 'helper') {
                autoMintIncrement += 1;
                sashyUpgradesContainer.style.display = 'block';
            } else if (type === 'double-click') {
                clickMultiplier *= 2;
            } else if (type === 'speed-up') {
                autoMintMultiplier *= 2;
            } else if (type === 'factory') {
                factoryContainer.style.display = 'block';
            } else if (type === 'mint-cube') {
                mintCubeContainer.style.display = 'block';
            } else if (type === 'mc-cube') {
                mcCubeContainer.style.display = 'block';
            } else if (type === 'fuuka') {
                fuukaContainer.style.display = 'block';
                moveFuuka();
                generateHearts();
            } else if (type === 'l4d2') {
                l4d2Container.style.display = 'block';
                spawnZombies();
            }

            item.style.display = 'none';
        }
    });
});

sashyUpgrades.forEach(upgrade => {
    upgrade.addEventListener('click', () => {
        const cost = parseInt(upgrade.getAttribute('data-cost'));
        const upgradeType = upgrade.getAttribute('data-upgrade');

        if (mintCount >= cost) {
            mintCount -= cost;
            updateMintCount();

            if (upgradeType === 'speed-2x') {
                sashySpeedMultiplier *= 2;
                startTimer('⏳', 30, () => sashySpeedMultiplier /= 2);
            } else if (upgradeType === 'temporary-2x') {
                applyTemporaryBoost(2, '⏳', 30);
            } else if (upgradeType === 'speed-3x') {
                sashySpeedMultiplier *= 3;
                startTimer('🔥', 30, () => sashySpeedMultiplier /= 3);
            } else if (upgradeType === 'permanent-10x') {
                autoMintIncrement *= 10;
            }

            upgrade.setAttribute('data-cost', Math.ceil(cost * 1.2)); // Increase cost for next purchase
        }
    });
});

sashyImage.addEventListener('click', () => {
    const audio = new Audio('honk.mp3');
    audio.play();
    showHearts();
});

factoryButton.addEventListener('click', () => {
    const isCrit = Math.random() < 0.1;
    const audio = new Audio(isCrit ? 'crit.mp3' : 'hit.mp3');
    audio.play();

    mintCount += isCrit ? 10 : 1;
    updateMintCount();
    showMintGain(isCrit ? 10 : 1);
});

mintCubeButton.addEventListener('click', () => {
    if (radioPlaying) {
        radioAudio.pause();
        radioAudio.currentTime = 0;
        document.querySelectorAll('.note').forEach(note => note.remove());
    } else {
        radioAudio.play();
        showNotes();
    }
    radioPlaying = !radioPlaying;
});

mcCubeButton.addEventListener('click', () => {
    mcCubeClicks++;
    const audio = new Audio(mcCubeClicks === 4 ? 'break.mp3' : 'dig.mp3');
    audio.play();

    if (mcCubeClicks === 4) {
        mcCubeClicks = 0;
        mintCount += 50;
        updateMintCount();
        showMintGain(50);
        breakCube();
        const popAudio = new Audio('pop.mp3');
        popAudio.play();
    }
    createBreakPieces();
});

function applyTemporaryBoost(multiplier, emoji, duration) {
    autoMintMultiplier *= multiplier;
    startTimer(emoji, duration, () => autoMintMultiplier /= multiplier);
}

function startTimer(emoji, duration, callback) {
    sashyTimerEmoji.textContent = emoji;
    sashyTimer.style.display = 'block';
    sashyTimerCountdown.textContent = duration;
    const interval = setInterval(() => {
        duration -= 1;
        sashyTimerCountdown.textContent = duration;
        if (duration <= 0) {
            clearInterval(interval);
            sashyTimer.style.display = 'none';
            callback();
        }
    }, 1000);
}

function showHearts() {
    for (let i = 0; i < 5; i++) {
        const heart = document.createElement('div');
        heart.textContent = '❤️';
        heart.classList.add('heart');
        heart.style.left = `${sashyImage.getBoundingClientRect().left + 50}px`;
        heart.style.top = `${sashyImage.getBoundingClientRect().top}px`;
        document.body.appendChild(heart);

        setTimeout(() => {
            document.body.removeChild(heart);
        }, 1000); // Heart lasts for 1 second
    }
}

function showNotes() {
    for (let i = 0; i < 5; i++) {
        const note = document.createElement('div');
        note.textContent = '🎵';
        note.classList.add('note');
        note.style.left = `${mintCubeButton.getBoundingClientRect().left + 50}px`;
        note.style.top = `${mintCubeButton.getBoundingClientRect().top}px`;
        document.body.appendChild(note);

        setTimeout(() => {
            document.body.removeChild(note);
        }, 1000); // Note lasts for 1 second
    }
}

function showMintGain(amount) {
    for (let i = 0; i < amount; i++) {
        const mint = document.createElement('div');
        mint.textContent = '🍬';
        mint.classList.add('mint');
        mint.style.left = `${mintCountDisplay.getBoundingClientRect().left + 20}px`;
        mint.style.top = `${mintCountDisplay.getBoundingClientRect().top}px`;
        document.body.appendChild(mint);

        setTimeout(() => {
            document.body.removeChild(mint);
        }, 1000); // Mint lasts for 1 second
    }
}

function breakCube() {
    const pieces = [];
    for (let i = 0; i < 5; i++) {
        const piece = document.createElement('div');
        piece.textContent = '🟫';
        piece.classList.add('break-piece');
        piece.style.left = `${mcCubeButton.getBoundingClientRect().left}px`;
        piece.style.top = `${mcCubeButton.getBoundingClientRect().top}px`;
        pieces.push(piece);
        document.body.appendChild(piece);
    }
    setTimeout(() => {
        pieces.forEach(piece => document.body.removeChild(piece));
    }, 1000);
}

function createBreakPieces() {
    for (let i = 0; i < 5; i++) {
        const piece = document.createElement('div');
        piece.textContent = '🟫';
        piece.classList.add('break-piece');
        piece.style.left = `${mcCubeButton.getBoundingClientRect().left + (Math.random() - 0.5) * 100}px`;
        piece.style.top = `${mcCubeButton.getBoundingClientRect().top + (Math.random() - 0.5) * 100}px`;
        document.body.appendChild(piece);

        setTimeout(() => {
            document.body.removeChild(piece);
        }, 1000); // Piece lasts for 1 second
    }
}

function generateHearts() {
    setInterval(() => {
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('div');
            heart.textContent = '❤️';
            heart.classList.add('heart');
            heart.style.left = `${fuukaImage.getBoundingClientRect().left + (Math.random() - 0.5) * 50}px`;
            heart.style.top = `${fuukaImage.getBoundingClientRect().top + (Math.random() - 0.5) * 50}px`;
            document.body.appendChild(heart);

            setTimeout(() => {
                document.body.removeChild(heart);
            }, 1000); // Heart lasts for 1 second
        }
    }, 1000);
}

function moveFuuka() {
    setInterval(() => {
        fuukaContainer.style.left = `${Math.random() * (window.innerWidth - 100)}px`;
        fuukaContainer.style.bottom = `${Math.random() * (window.innerHeight - 100)}px`;
    }, 3000);
}

function spawnZombies() {
    setInterval(() => {
        const zombie = document.createElement('img');
        zombie.src = 'zombie.gif';
        zombie.classList.add('zombie');
        zombie.style.position = 'absolute';
        zombie.style.bottom = '20px';
        zombie.style.left = `${Math.random() * window.innerWidth}px`;
        document.body.appendChild(zombie);

        const interval = setInterval(() => {
            if (parseInt(zombie.style.left) > window.innerWidth) {
                clearInterval(interval);
                document.body.removeChild(zombie);
            } else {
                zombie.style.left = `${parseInt(zombie.style.left) + 1}px`;
            }
        }, 50);

        zombie.addEventListener('click', () => {
            const audio = new Audio('hit.mp3');
            audio.play();
            mintCount += 5;
            updateMintCount();
            document.body.removeChild(zombie);
        });
    }, 3000);
}

function startMintRain() {
    setInterval(() => {
        const mint = document.createElement('div');
        mint.textContent = '🍬';
        mint.classList.add('mint-fall');
        mint.style.left = `${Math.random() * window.innerWidth}px`;
        document.body.appendChild(mint);

        setTimeout(() => {
            document.body.removeChild(mint);
        }, 5000); // Mint falls for 5 seconds
    }, 5000 / memoryCount); // Increase frequency with more memories
}

function updateMintCount() {
    mintCountDisplay.textContent = mintCount;
}

function renderLockedMemories() {
    memories.forEach(memory => {
        const lockedMemoryDiv = document.createElement('div');
        lockedMemoryDiv.classList.add('locked-memory');
        lockedMemoryDiv.innerHTML = `
            <p>Memory locked - requires ${memory.mintsRequired} mints</p>
            <button class="unlock-memory" data-required="${memory.mintsRequired}">Unlock</button>
        `;
        memoriesContainer.appendChild(lockedMemoryDiv);

        const unlockButton = lockedMemoryDiv.querySelector('.unlock-memory');
        unlockButton.addEventListener('click', () => {
            if (mintCount >= memory.mintsRequired && !memory.unlocked) {
                mintCount -= memory.mintsRequired;
                updateMintCount();
                renderUnlockedMemory(memory);
                memory.unlocked = true;
                memoryCount++;
                if (memoryCount === 1) {
                    startMintRain();
                }
                lockedMemoryDiv.style.display = 'none';
            }
        });
    });
}

function renderUnlockedMemory(memory) {
    const memoryDiv = document.createElement('div');
    memoryDiv.classList.add('memory');
    memoryDiv.innerHTML = `
        <p>${memory.text}</p>
        <img src="${memory.image}" alt="Memory Image">
        <video controls>
            <source src="${memory.video}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    `;
    memoriesContainer.appendChild(memoryDiv);
}

function generateAutoMints() {
    mintCount += autoMintIncrement * autoMintMultiplier * sashySpeedMultiplier;
    updateMintCount();
}

renderLockedMemories();
setInterval(generateAutoMints, 1000); // Generate mints every second based on autoMintIncrement
