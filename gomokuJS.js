/*
 * gomokuJs.js
 *
 */
/*
 * The gomoku Board class
 */
var GLOBAL = {
    boardStatus: {
                    UNDETERMINED: 0,
                    WIN: 1,
                    PARAM_ERROR: -1,
                    FORBIDDEN_LONG_CHAIN: -2,
                    FORBIDDEN_3_3: -3,
                    FORBIDDEN_4_4: -4
    },
    color: {
        BLACK: 0,
        WHITE: 1
    }
};

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function Board() {
    this.DIMENSION = 15;
    this.UNOCCUPIED = -1;
    this.matrix = new Array(15);
    for (var i = 0; i < 15; i += 1) {
        this.matrix[i] = new Array(15);
        for (var j = 0; j < 15; j++) {
            this.matrix[i][j] = this.UNOCCUPIED;
        }
    }
}

Board.prototype = {
    constructor: Board,
    occupied: function(x, y) {
        return !(this.matrix[x][y] == -1);
    },
    put: function(color, x, y) {
        if (x >= 15 || y >= 15) {
            window.alert('Invalid x or y axis:' + x + ' ' + y);
            return GLOBAL.boardStatus.PARAM_ERROR;
        }
        if (this.matrix[x][y] != this.UNOCCUPIED) {
            return -1;
        }
        this.matrix[x][y] = color;
        return 0;
    },
	judge: function(color, x, y) {
        if (x >= 15 || y >= 15) {
            window.alert('Invalid x or y axis:' + x + ' ' + y);
            return GLOBAL.boardStatus.PARAM_ERROR;
        }

        var chain = 0;
        var maxChain = 0;
        var i = 0;
        var j = 0;
        var win = false;
        var forbidden = false;
        // chain of left-right
        for (i = Math.max(x - 5, 0); i <= Math.min(x + 5, this.DIMENSION - 1); ++i) {
            if (this.matrix[i][y] != color) {
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
            return GLOBAL.boardStatus.WIN;
        }
        else if (maxChain > 5) {
            return GLOBAL.boardStatus.FORBIDDEN_LONG_CHAIN;
        }

        // chain of up-down
        chain = 0;
        win = false;
        maxChain = 0;
        for (i = Math.max(y - 5, 0); i <= Math.min(y + 5, this.DIMENSION - 1); ++i) {
            if (this.matrix[x][i] != color) {
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
            return GLOBAL.boardStatus.WIN;
        }
        else if (maxChain > 5) {
            return GLOBAL.boardStatus.FORBIDDEN_LONG_CHAIN;
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
            if (this.matrix[i][j] != color) {
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
            return GLOBAL.boardStatus.WIN;
        }
        else if (maxChain > 5) {
            return GLOBAL.boardStatus.FORBIDDEN_LONG_CHAIN;
        }

        // chain of bottomright-upleft
        chain = 0;
        maxChain = 0;
        win = false;
        for (i = Math.max(x - 5, 0); i <= Math.min(x + 5, this.DIMENSION - 1); ++i) {
            j = (x + y) - i;
            if (this.matrix[i][j] != color) {
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
            return GLOBAL.boardStatus.WIN;
        }
        else if (maxChain > 5) {
            return GLOBAL.boardStatus.FORBIDDEN_LONG_CHAIN;
        }
    }
};

function Player (name) {
    this.name = name;
    this.color = GLOBAL.color.BLACK;
}

Player.prototype = {
    constructor: Player,
    setColor: function(color) {
        this.color = color;
    },
    associateBoard: function(board) {
        this.board = board;
    },
    go: function(x, y) {
        if (this.board.put(this.color, x, y) != 0) {
            return -1;
        }
        var board = document.getElementById('main');
        var piece = document.createElement('IMG');
        if (this.color == GLOBAL.color.WHITE) {
            piece.setAttribute('src', 'images/white.png');
        }
        else {
            piece.setAttribute('src', 'images/black.png');
        }
        board.appendChild(piece);
        piece.style.position = 'absolute';
        piece.style.left = x * 32 + 3 + 'px';
        piece.style.bottom = y * 32 + 5 + 'px';

        return 0;
    },
    autoMove: function() {
        while (1) {
            x = Math.floor(Math.random() * this.board.DIMENSION);
            y = Math.floor(Math.random() * this.board.DIMENSION);
            if (!this.board.occupied(x, y)) {
                break;
            }
        }
        this.go(x, y);
        return new Point(x, y);
    }
}