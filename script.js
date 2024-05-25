let mintCount = 0;
const mintButton = document.getElementById('mint-button');
const mintCountDisplay = document.getElementById('mint-count');
const memoriesContainer = document.getElementById('memories');
const unlockedMemoriesContainer = document.getElementById('unlocked-memories');
const storeItems = document.querySelectorAll('.item');
const sashyUpgradesContainer = document.getElementById('sashy-upgrades');
const sashyImage = document.getElementById('sashy-image');
const factoryButton = document.getElementById('factory-button');
const factoryContainer = document.getElementById('factory-container');
const mintCubeButton = document.getElementById('mint-cube-button');
const mintCubeContainer = document.getElementById('mint-cube-container');
const mcCubeButton = document.getElementById('mc-cube-button');
const mcCubeContainer = document.getElementById('mc-cube-container');
const fuukaContainer = document.getElementById('fuuka-container');
const fuukaImage = document.getElementById('fuuka-image');
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
    { mintsRequired: 150, text: "Memory 3: A special birthday celebration.", image: "path/to/image3.jpg", video: "path/to/image3.mp4", unlocked: false },
    { mintsRequired: 200, text: "Memory 4: Family reunion.", image: "path/to/image4.jpg", video: "path/to/image4.mp4", unlocked: false },
    { mintsRequired: 250, text: "Memory 5: Our first trip abroad.", image: "path/to/image5.jpg", video: "path/to/image5.mp4", unlocked: false },
    { mintsRequired: 300, text: "Memory 6: Fun at the amusement park.", image: "path/to/image6.jpg", video: "path/to/image6.mp4", unlocked: false },
    { mintsRequired: 350, text: "Memory 7: Our anniversary.", image: "path/to/image7.jpg", video: "path/to/image7.mp4", unlocked: false },
    { mintsRequired: 400, text: "Memory 8: Holiday celebration.", image: "path/to/image8.jpg", video: "path/to/image8.mp4", unlocked: false },
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
                moveMintCube();
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
    if (masksUnlocked && !lootboxCooldown && mintCount >= 500) {
        mintCount -= 500;
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
    for (let i = 0; i < 10; i++) {
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

function moveSashy() {
    let x = Math.random() * 150; // Designated width
    let y = Math.random() * 300; // Designated height
    let dx = 1;
    let dy = 1;

    const moveInterval = setInterval(() => {
        x += dx * sashySpeedMultiplier;
        y += dy * sashySpeedMultiplier;

        if (x <= 0 || x + sashyImage.offsetWidth >= 150) {
            dx = -dx;
        }

        if (y <= 0 || y + sashyImage.offsetHeight >= 300) {
            dy = -dy;
        }

        sashyImage.style.left = `${x}px`;
        sashyImage.style.top = `${y}px`;
    }, 50); // Smooth movement

    // Change Sashy's expression periodically
    setInterval(() => {
        sashyImage.src = 'sashy2.png';
        setTimeout(() => {
            sashyImage.src = 'sashy.png';
        }, 1000); // Change back to original after 1 second
    }, 5000); // Change expression every 5 seconds
}

function moveMintCube() {
    mintCubeContainer.style.bottom = '150px';
    mintCubeContainer.style.left = '20px';
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

// New Sashy Upgrades
const sashyUpgrades = [
    { name: 'Sashy\'s PC', cost: 10, increment: 1, description: 'He can program +1 Mints a second' },
    { name: 'Sashy\'s Books', cost: 50, increment: 5, description: 'Having learned the way of Mints, he can now generate +5 Mints a second' },
    { name: 'Sashy\'s Trinkets', cost: 100, increment: 10, description: 'Sashy\'s collection of trinkets makes him happier, making him generate +10 Mints a second- Wait its just mostly knifes?' },
    { name: 'Sashy\'s Plushies', cost: 500, increment: 50, description: 'Feeling protected and having a good night sleep, Sashy generates +50 Mints a second' },
    { name: 'Sashy\'s Motivation', cost: 1000, increment: 100, description: 'Sashy just got a burst of motivation! Nothing can stop him from generating +100 Mints a second now!' },
    { name: 'Mini Plushie', cost: 5000, increment: 500, description: 'Sashy\'s secret weapon to staying happy, making him generate +500 Mints a second!' }
];

sashyUpgrades.forEach(upgrade => {
    const upgradeElement = document.createElement('div');
    upgradeElement.classList.add('sashy-upgrade');
    upgradeElement.setAttribute('data-cost', upgrade.cost);
    upgradeElement.setAttribute('data-description', upgrade.description);
    upgradeElement.setAttribute('data-increment', upgrade.increment);
    upgradeElement.textContent = `${upgrade.name} - ${upgrade.cost} mints`;

    upgradeElement.addEventListener('click', () => {
        const cost = parseInt(upgradeElement.getAttribute('data-cost'));
        const increment = parseInt(upgradeElement.getAttribute('data-increment'));
        if (mintCount >= cost) {
            mintCount -= cost;
            updateMintCount();
            autoMintIncrement += increment;
            upgradeElement.style.display = 'none';
        }
    });

    sashyUpgradesContainer.appendChild(upgradeElement);
});

renderLockedMemories();
setInterval(generateAutoMints, 1000); // Generate mints every second based on autoMintIncrement
moveSashy();
moveMintCube();
