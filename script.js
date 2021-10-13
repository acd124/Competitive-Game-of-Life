const board = new Board();

function leftGliderArmy() {
    for (let x = 0; x < 6; x++) {
        for (let y = 0; y < 11; y++) {
            board.game.toggleSquare(x * 5, y * 6);
            board.game.toggleSquare(x * 5, y * 6 + 3);
            board.game.toggleSquare(x * 5 + 2, y * 6 + 1);
            board.game.toggleSquare(x * 5 + 2, y * 6 + 2);
        }
    }
    board.draw();
}

function rightWall() {
    for (let i = 1; i < 64; i += 2) board.game.toggleSquare(63, i);
    board.draw();
}