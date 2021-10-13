class Board {
    COLORS = ['grey', 'darkgrey', 'green', 'blue'];

    constructor() {
        this.canvas = document.getElementById('boardCanvas');
        this.game = null;

        this.freeplay = false;
        this.gridOff = false;

        this.animation = null;
        this.animationSpeed = 1000;

        this.canvas.onclick = this.click.bind(this);
        this.resize();
    }

    step() {
        this.game.nextGeneration();
        this.draw();
        document.getElementById('generations').innerText = this.game.generations;
    }

    unstep() {
        this.game.reverseState();
        this.draw();
        document.getElementById('generations').innerText = this.game.generations;
    }

    animate() {
        this.animation = setTimeout(() => {
            this.step();
            this.animate();
        }, this.animationSpeed);
    }

    stop() {
        clearInterval(this.animation);
        delete this.animation;
    }

    updateSpeed() {
        this.animationSpeed = document.getElementById('speed').value * 1000;
    }

    draw() {
        const context = this.canvas.getContext('2d');
        const grid = this.game.gameState;
        const squareWidth = this.canvas.width / this.game.x;
        const squareHeight = this.canvas.height / this.game.y;
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                context.fillStyle = this.COLORS[grid[y][x]];
                context.fillRect(
                    x * squareWidth,
                    y * squareHeight,
                    squareWidth,
                    squareHeight
                );
                
                if (!this.gridOff) {
                    context.beginPath();
                    context.rect(
                        x * squareWidth,
                        y * squareHeight,
                        squareWidth,
                        squareHeight
                    );
                    context.stroke();
                }
            }
        }
    }

    resize(
        x = document.getElementById('width').value || 16, 
        y = document.getElementById('height').value || 16
    ) {
        this.game = new LifeGame(Math.floor(x), Math.floor(y));
        this.draw();
        document.getElementById('generations').innerText = this.game.generations;
    }

    changeRules(
        born = document.getElementById('bornOn').value, 
        live = document.getElementById('liveOn').value
    ) {
        born = born.split('')
            .map(Number)
            .filter((n, i, r) => !isNaN(n) && r.indexOf(n) === i)
            .sort((a, b) => a - b);
        live = live.split('')
            .map(Number)
            .filter((n, i, r) => !isNaN(n) && r.indexOf(n) === i)
            .sort((a, b) => a - b);
        this.game = new LifeGame(
            this.game.x,
            this.game.y,
            born.length ? born : undefined,
            live.length ? live : undefined
        );
        this.draw();
        document.getElementById('generations').innerText = this.game.generations;
        document.getElementById('bornOn').value = born.join('');
        document.getElementById('liveOn').value = live.join('');
    }

    toggleMode() { this.freeplay = !this.freeplay; }
    toggleGrid() { this.gridOff = !this.gridOff; this.draw(); }

    click(e) {
        const { width, height } = this.canvas.getBoundingClientRect();
        const squareWidth = width / this.game.x;
        const squareHeight = height / this.game.y;
        this.game[this.freeplay ? 'incSquare' : 'toggleSquare'](
            Math.floor(e.offsetX / squareWidth),
            Math.floor(e.offsetY / squareHeight)
        );
        this.draw();
    }
}