/*
 * gomokuJs.js
 *
 */

/*
 * The gomoku Board class
 */
function Board() {
    this.matrix = new Array(15);
    for (var i = 0; i < 15; i++) {
        this.matrix[i] = new Array(15);
        for (var j = 0; j < 15; j++) {
            this.matrix[i][j] = -1;
        }
    }
};

Board.prototype = {
	constructor: Board,
	judge: function(op, x, y) {
        if (x >= 15 || y >= 15) {
            alert('Invalid x or y axis:' + x + ' ' + y);
            return -1;
        }
        this.matrix[x][y] = op;

        // chain of left-right
        var minx = min(x - 4, 0);
        for (var i = minx; i < x; ++i) {
            var chain = 0;
            var win = false;
            for (var j = i + 1; j < i + 5; ++j) {
                if (this.matrix[i][j] == op) {
                    chain++;
                    if (chain == 5) {
                        win = true;
                        break;
                    }
                }
                else {
                    break;
                }
            }
            if (win == true) {
                break;
            }
        }

        // chain of up-down
        var miny = min(y - 4, 0);
        for (var i = miny; i < y; ++i) {
            var chain = 0;
            var win = false;
            for (var j = i + 1; j < i + 5; ++j) {
                if (this.matrix[i][j] == op) {
                    chain++;
                    if (chain == 5) {
                        win = true;
                        break;
                    }
                }
                else {
                    break;
                }
            }
            if (win == true) {
                break;
            }
        }

    }
};

function Player (color) {
    if (typeof(color) !== "string") {
        return null;
    }
    this.color = color;
};

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
};