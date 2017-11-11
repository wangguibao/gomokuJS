/*
 * gomokuJs.js
 * Reference: http://blog.csdn.net/clhmw/article/category/1163342
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
        this.myState = new Array(this.board.DIMENSION);
        
        var i = 0;
        var j = 0;
        var k = 0;
           for (i = 0; i < this.board.DIMENSION; ++i) {
            this.myState[i] = new Array(this.board.DIMENSION);
            for (j = 0; j < this.board.DIMENSION; ++j) {
                this.myState[i][j] = new Array(8);
                for (k = 0; k < 8; ++k) {
                    this.myState[i][j][k] = new Array(2);
                    this.myState[i][j][k][0] = this.myState[i][j][k][1] = -1;
                }
            }
        }
        
        this.score = new Array(this.board.DIMENSION);
        for (i = 0; i < this.board.DIMENSION; ++i) {
            this.score[i] = new Array(this.board.DIMENSION);
            for (j = 0; j < this.board.DIMENSION; ++j) {
                this.score[i][j] = new Array(2);
                this.score[i][j][0] = this.score[i][j][1] = 0;
            }
        }
    },
    resetState: function() {
        var i = 0;
        var j = 0;
        var k = 0;
           for (i = 0; i < this.board.DIMENSION; ++i) {
            for (j = 0; j < this.board.DIMENSION; ++j) {
                for (k = 0; k < 8; ++k) {
                    this.myState[i][j][k][0] = this.myState[i][j][k][1] = -1;
                }
            }
        }
        
        for (i = 0; i < this.board.DIMENSION; ++i) {
            for (j = 0; j < this.board.DIMENSION; ++j) {
                this.score[i][j][0] = this.score[i][j][1] = 0;
            }
        }
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

    evaluateLevel1: function() {
        this.resetState();
        // Check each of the 8-directions counter-clockwise
        // Starting from down, then down-right, then right... till down-left
        var stepX = [ 0,  1, 1, 1, 0, -1, -1, -1];
        var stepY = [-1, -1, 0, 1, 1,  1,  0, -1];

        var i = 0;
        var j = 0;
        var k = 0;
        var n = 0;
        var opponentColor = +(!this.color);
        // Consequtive pieces with same color / opponent color
        var curX = 0;
        var curY = 0;
        for (i = 0; i < this.board.DIMENSION; ++i) {
            for (j = 0; j < this.board.DIMENSION; ++j) {
                if (this.board.matrix[i][j] != this.board.UNOCCUPIED) {
                    continue;
                }

                for (k = 0; k < 8; ++k) {
                    // same color
                    curX = i;
                    curY = j;
                    count = 0;
                    for (n = 0; n < 5; ++n) {
                        curX += stepX[k];
                        curY += stepY[k];
                        if (curX < 0 || curX >= this.board.DIMENSION || curY < 0 || curY >= this.board.DIMENSION) {
                            break;
                        }
                        if (this.board.matrix[curX][curY] != this.color) {
                            break;
                        }
                        count++;
                    }
                    this.myState[i][j][k][this.color] = count;

                    // opponent color
                    curX = i;
                    curY = j;
                    count = 0;
                    for (n = 0; n < 5; ++n) {
                        curX += stepX[k];
                        curY += stepY[k];
                        if (curX < 0 || curX >= this.board.DIMENSION || curY < 0 || curY >= this.board.DIMENSION) {
                            break;
                        }
                        if (this.board.matrix[curX][curY] != opponentColor) {
                            break;
                        }
                        count++;
                    }
                    this.myState[i][j][k][opponentColor] = count;
                }
            }
        }

        // Score
        var score = 0;
        for (i = 0; i < this.board.DIMENSION; ++i) {
            for (j = 0; j < this.board.DIMENSION; ++j) {
                if (this.board.matrix[i][j] != this.board.UNOCCUPIED) {
                    continue;
                }

                score = 0;
                for (k = 0; k < 4; ++k) {
                    count = this.myState[i][j][k][this.color] + this.myState[i][j][k + 4][this.color];
                    if (count >= 4) {
                        score += 10000;
                    }
                    else if (count == 3) {
                        score += 1000;
                    }
                    else if (count == 2) {
                        score += 100;
                    }
                    else if (count == 1) {
                        score += 10;
                    }
                }

                this.score[i][j][this.color] = score;

                score = 0;
                for (k = 0; k < 4; ++k) {
                    count = this.myState[i][j][k][opponentColor] + this.myState[i][j][k + 4][opponentColor];
                    if (count >= 4) {
                        score += 10000;
                    }
                    else if (count == 3) {
                        score += 1000;
                    }
                    else if (count == 2) {
                        score += 100;
                    }
                    else if (count == 1) {
                        score += 10;
                    }
                }

                this.score[i][j][opponentColor] = score;
            }
        }

        var defensivePoint = new Point(0, 0);
        var offensivePoint = new Point(0, 0);

        for (i = 0; i < this.board.DIMENSION; ++i) {
            for (j = 0; j < this.board.DIMENSION; ++j) {
                var curScore = this.score[offensivePoint.x][offensivePoint.y][this.color];
                if (curScore < this.score[i][j][this.color]) {
                    offensivePoint.x = i;
                    offensivePoint.y = j;
                }

                curScore = this.score[defensivePoint.x][defensivePoint.y][opponentColor];
                if (curScore < this.score[i][j][opponentColor]) {
                    defensivePoint.x = i;
                    defensivePoint.y = j;
                }
            }
        }

        var offensiveScore = this.score[offensivePoint.x][offensivePoint.y][this.color];
        var defensiveScore = this.score[defensivePoint.x][defensivePoint.y][opponentColor];
        if (offensiveScore > defensiveScore) {
            return offensivePoint;
        }
        else {
            return defensivePoint;
        }
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
    },

    defensiveMoveLevel1: function() {
        var point = this.evaluateLevel1();
        this.go(point.x, point.y);
        return point;
    }
}