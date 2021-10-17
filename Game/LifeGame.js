class LifeGame {
    constructor(x, y, bornOn = [2], liveOn = [2, 3]) {
        this.x = x;
        this.y = y;
        this.bornOn = bornOn;
        this.liveOn = liveOn;
        this.gameState = this.newState();
        this.pastStates = [];
        this.maxPastStates = 1000;

        this.generations = 0;
        //this.initStart();
    }

    initStart() {
        const startSquares = [
            [0, 6, 2], [0, 9, 2], [2, 7, 2], [2, 8, 2],
            [0, 0, 2], [0, 3, 2], [2, 1, 2], [2, 2, 2],
            [0, 12, 2], [0, 15, 2], [2, 13, 2], [2, 14, 2],
            [5, 6, 2], [5, 9, 2], [7, 7, 2], [7, 8, 2],
            [5, 0, 2], [5, 3, 2], [7, 1, 2], [7, 2, 2],
            [5, 12, 2], [5, 15, 2], [7, 13, 2], [7, 14, 2],
            [12, 7, 3], [12, 8, 3], [13, 7, 3], [13, 8, 3]
        ];
        for (const [x, y, val] of startSquares) {
            this.gameState[y][x] = val ?? 1;
        }
    }

    toggleSquare(x, y) {
        if (!this.inBounds(x, y)) return false;
        this.gameState[y][x] = !this.gameState[y][x] ? (x < this.x / 2 ? 2 : 3) : 0;
    }

    incSquare(x, y) {
        if (!this.inBounds(x, y)) return false;
        this.gameState[y][x] = (this.gameState[y][x] + 1) % 4;
        return true;
    }

    setSquare(x, y, value) {
        return this.inBounds(x, y) && !!((this.gameState[y][x] = value) || true);
    }

    nextGeneration() {
        const nextGen = this.newState();

        for (let i = 0; i < nextGen.length; i++) {
            for (let j = 0; j < nextGen[i].length; j++) {
                const neighbors = this.neighborsOf(j, i);
                const twos = neighbors.filter(n => n === 2).length;
                const threes = neighbors.filter(n => n === 3).length;
                nextGen[i][j] = !this.liveOn.includes(neighbors.length) &&
                    (!this.bornOn.includes(neighbors.length) || this.gameState[i][j]) ? 0
                    : this.bornOn.includes(neighbors.length) && !this.gameState[i][j]
                    ? (twos === threes ? 1 : twos > threes ? 2 : 3)
                    : this.gameState[i][j];
            }
        }
        const pastState = this.stringState(this.gameState)
        this.pastStates.unshift(pastState);
        if (this.pastStates.length > this.maxPastStates) this.pastStates.pop();

        this.generations++;
        this.gameState = nextGen;

        if (this.pastStates.includes(this.stringState(this.gameState)))
            console.log('repeating', this.generations);
    }

    neighborsOf(x, y) {
        const neighbors = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if ((i === j && j === 0) || !this.inBounds(x + j, y + i)) continue;
                neighbors.push(this.gameState[y + i][x + j]);
            }
        }
        return neighbors.filter(n => n);
    }

    newState() { return Array.from({ length: this.y }, () => Array(this.x).fill(0)); }

    inBounds(x, y) {
        return x >= 0 && y >= 0 && x < this.x && y < this.y;
    }

    stringState(state) {
        return state.map(row => row.join('')).join('');
    }

    stringToState(state, rowLength = this.x) {
        if (state.length % rowLength)
            throw new Error('Invalid state string, length must be a multiple of rowLength');
        return Array.from(
            { length: state.length / rowLength },
            (_, i) => Array.from({ length: rowLength }, (_, k) => Number(state[i * rowLength + k]))
        );
    }

    reverseState() {
        if (!this.pastStates.length) return false;
        this.gameState = this.stringToState(this.pastStates.shift());
        this.generations--;
        return true;
    }
}