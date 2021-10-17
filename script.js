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

function centerSquare () {
    const minX = Math.ceil(board.game.x / 2) - 1;
    const maxX = Math.floor(board.game.x / 2);
    const minY = Math.ceil(board.game.y / 2) - 1;
    const maxY = Math.floor(board.game.y / 2);

    board.game.setSquare(minX, minY, 2);
    board.game.setSquare(minX, maxY, 2);
    board.game.setSquare(maxX, maxY, 2);
    board.game.setSquare(maxX, minY, 2);
    board.draw();
}