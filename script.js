let mintCount = 0;
const mintButton = document.getElementById('mint-button');
const mintCountDisplay = document.getElementById('mint-count');
const memoriesContainer = document.getElementById('memories');
const unlockedMemoriesContainer = document.getElementById('unlocked-memories');
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
const lootboxImage = document.getElementById('lootbox-image');
const masksInventory = document.getElementById('masks-inventory');
const masksDlcContainer = document.getElementById('masks-dlc-container');

let mcCubeClicks = 0;
let radioPlaying = false;
let autoMintIncrement = 0;
let clickMultiplier = 1;
let autoMintMultiplier = 1;
let sashySpeedMultiplier = 1;
let memoryCount = 0;
let masksUnlocked = false;
let lootboxCooldown = false;

const radioAudio = new Audio('radio.mp3');
radioAudio.loop = true;

const maskImages = {
    common: [
        { src: 'common1.png', description: 'A basic mask', rarity: 'COMMON', value: 50 },
        { src: 'common2.png', description: 'First steps into robbery', rarity: 'COMMON', value: 50 },
        { src: 'common3.png', description: 'A very basic but sweet mask!', rarity: 'COMMON', value: 50 },
        { src: 'common4.png', description: 'Huh what is this doing here?', rarity: 'COMMON', value: 50 },
        { src: 'common5.png', description: "Honestly doesn't deserve to be common", rarity: 'COMMON', value: 50 }
    ],
    uncommon: [
        { src: 'uncommon1.png', description: "Its beeen soo looong", rarity: 'UNCOMMON', value: 200 },
        { src: 'uncommon2.png', description: 'The one mask to rule them all', rarity: 'UNCOMMON', value: 200 },
        { src: 'uncommon3.png', description: 'Go to bed joker', rarity: 'UNCOMMON', value: 200 }
    ],
    epic: [
        { src: 'epic1.png', description: 'Happiness.png!!!', rarity: 'EPIC', value: 500 },
        { src: 'epic2.png', description: "WE'RE GOING TO BE RICH!", rarity: 'EPIC', value: 500 }
    ],
    legendary: [
        { src: 'legendary1.png', description: 'I mean- cmon, of course this one would be the rarest!', rarity: 'LEGENDARY', value: 2000 }
    ]
};

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

document.addEventListener('keydown', (e) => {
    if (e.code === 'Numpad0') {
        mintCount += 1000;
        updateMintCount();
    }
});

storeItems.forEach(item => {
    item.addEventListener('mouseover', () => {
        const audio = new Audio('click.mp3');
        audio.play();
    });
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
            } else if (type === 'masks-dlc') {
                masksDlcContainer.style.display = 'block';
                masksUnlocked = true;
            }

            item.style.display = 'none';
        }
    });
});

sashyUpgrades.forEach(upgrade => {
    upgrade.addEventListener('mouseover', () => {
        const audio = new Audio('click.mp3');
        audio.play();
    });
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
    mcCubeButton.classList.add('clicked');
    setTimeout(() => mcCubeButton.classList.remove('clicked'), 200);
    createBreakPieces();
});

lootboxImage.addEventListener('click', () => {
    if (masksUnlocked && !lootboxCooldown && mintCount >= 1000) {
        mintCount -= 1000;
        updateMintCount();
        lootboxCooldown = true;
        const unlockingAudio = new Audio('unlocking.wav');
        unlockingAudio.play();
        lootboxImage.classList.add('unlocking');
        setTimeout(() => {
            lootboxImage.classList.remove('unlocking');
            const unlockedAudio = new Audio('unlocked.wav');
            unlockedAudio.play();
            addRandomMask();
            lootboxCooldown = false;
        }, 5000); // 5 seconds to unlock
    }
});

function addRandomMask() {
    const rarity = getRandomRarity();
    const maskList = maskImages[rarity];
    const randomMask = maskList[Math.floor(Math.random() * maskList.length)];
    const maskContainer = document.createElement('div');
    maskContainer.classList.add('mask');
    maskContainer.innerHTML = `
        <img src="${randomMask.src}" alt="${randomMask.description}">
        <div class="mask-description-container">
            <div class="mask-description">
                <q>${randomMask.description}</q>
                <span class="rarity ${randomMask.rarity.toLowerCase()}">${randomMask.rarity}</span>
                <button class="sell-button">Sell? (${randomMask.value} mints)</button>
            </div>
        </div>
    `;
    maskContainer.querySelector('.sell-button').addEventListener('click', () => {
        mintCount += randomMask.value;
        updateMintCount();
        masksInventory.removeChild(maskContainer);
    });
    maskContainer.addEventListener('click', () => {
        deselectAllMasks();
        maskContainer.classList.add('selected');
    });
    masksInventory.appendChild(maskContainer);
}

function deselectAllMasks() {
    document.querySelectorAll('.mask').forEach(mask => mask.classList.remove('selected'));
}

function getRandomRarity() {
    const random = Math.random();
    if (random < 0.6) return 'common';       // 60% chance
    if (random < 0.85) return 'uncommon';    // 25% chance
    if (random < 0.95) return 'epic';        // 10% chance
    return 'legendary';                      // 5% chance
}

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
    let x = Math.random() * (window.innerWidth - fuukaContainer.offsetWidth);
    let y = Math.random() * (window.innerHeight - fuukaContainer.offsetHeight);
    let dx = 2;
    let dy = 2;

    const moveInterval = setInterval(() => {
        x += dx;
        y += dy;

        if (x <= 0 || x + fuukaContainer.offsetWidth >= window.innerWidth) {
            dx = -dx;
        }

        if (y <= 0 || y + fuukaContainer.offsetHeight >= window.innerHeight) {
            dy = -dy;
        }

        fuukaContainer.style.left = `${x}px`;
        fuukaContainer.style.top = `${y}px`;
    }, 20); // Smooth movement
}

function startMintRain() {
    setInterval(() => {
        for (let i = 0; i < memoryCount * 2; i++) {
            const mint = document.createElement('div');
            mint.textContent = '🍬';
            mint.classList.add('mint-fall');
            mint.style.left = `${Math.random() * window.innerWidth}px`;
            mint.style.animationDuration = `${Math.random() * 5 + 3}s`; // Random duration
            document.body.appendChild(mint);

            setTimeout(() => {
                document.body.removeChild(mint);
            }, 5000); // Mint falls for 5 seconds
        }
    }, 1000); // Increase frequency with more memories
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
    unlockedMemoriesContainer.appendChild(memoryDiv);
}

function generateAutoMints() {
    mintCount += autoMintIncrement * autoMintMultiplier * sashySpeedMultiplier;
    updateMintCount();
}

renderLockedMemories();
setInterval(generateAutoMints, 1000); // Generate mints every second based on autoMintIncrement
