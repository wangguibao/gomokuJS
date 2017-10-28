/*
 * gomokuJs.js
 *
 */
/*
 * The gomoku Board class
 */
function Board() {
    this.DIMENSION = 15;
    this.UNOCCUPIED = -1;
    this.matrix = new Array(15);
    for (var i = 0; i < 15; i += 1) {
        this.matrix[i] = new Array(15);
        for (var j = 0; j < 15; j++) {
            this.matrix[i][j] = UNOCCUPIED;
        }
    }
}

Board.prototype = {
    constructor: Board,
    occupied: function(x, y) {
        return !(this.matrix[x][y] == -1);
    },

	judge: function(op, x, y) {
        if (x >= 15 || y >= 15) {
            window.alert('Invalid x or y axis:' + x + ' ' + y);
            return -1;
        }
        this.matrix[x][y] = op;

        var chain = 0;
        var maxChain = 0;
        var i = 0;
        var j = 0;
        var win = false;
        // chain of left-right
        for (i = Math.max(x - 5, 0); i <= Math.min(x + 5, this.DIMENSION - 1); ++i) {
            if (this.matrix[i][y] != op) {
                    maxChain = Math.max(chain, maxChain);
                    chain = 0;
            }
            else {
                chain++;
            }
        }

        if (maxChain == 0) {
            maxChain = chain;
        }
        if (maxChain == 5) {
            win = true;
            window.alert('You win');
            return 0;
        }

        // chain of up-down
        chain = 0;
        win = false;
        maxChain = 0;
        for (i = Math.max(y - 5, 0); i <= Math.min(y + 5, this.DIMENSION - 1); ++i) {
            if (this.matrix[x][i] != op) {
                maxChain = Math.max(chain, maxChain);
                chain = 0;
            }
            else {
                chain++;
            }
        }

        if (maxChain == 0) {
            maxChain = chain;
        }
        if (maxChain == 5) {
            win = true;
            window.alert('You win');
            return 0;
        }

        // chain of bottomleft-upright
        chain = 0;
        maxChain = 0;
        win = false;
        for (i = Math.max(x - 5, 0); i <= Math.min(x + 5, this.DIMENSION - 1); ++i) {
            j = i - (x - y);
            if (j < 0) {
                continue;
            }
            if (this.matrix[i][j] != op) {
                maxChain = Math.max(chain, maxChain);
                chain = 0;
            }
            else {
                chain++;
            }
        }

        if (maxChain == 0) {
            maxChain = chain;
        }
        if (maxChain == 5) {
            win = true;
            window.alert('You win');
            return 0;
        }

        // chain of bottomright-upleft
        chain = 0;
        maxChain = 0;
        win = false;
        for (i = Math.max(x - 5, 0); i <= Math.min(x + 5, this.DIMENSION - 1); ++i) {
            j = (x + y) - i;
            if (this.matrix[i][j] != op) {
                maxChain = Math.max(chain, maxChain);
                chain = 0;
            }
            else {
                chain++;
            }
        }

        if (maxChain == 0) {
            maxChain = chain;
        }
        if (maxChain == 5) {
            win = true;
            window.alert('You win');
            return 0;
        }
    }
};

function Player (color) {
    if (typeof(color) !== "string") {
        return null;
    }
    this.color = color;
}

Player.prototype = {
    constructor: Player,
    go: function(x, y) {
        var board = document.getElementById('main');
        var piece = document.createElement('IMG');
        if (this.color == 'white') {
            piece.setAttribute('src', 'images/white.png');
        }
        else {
            piece.setAttribute('src', 'images/black.png');
        }
        board.appendChild(piece);
        piece.style.position = 'absolute';
        piece.style.left = x * 32 + 3 + 'px';
        piece.style.bottom = y * 32 + 5 + 'px';
    }
}