
function MessageBox() {
    this.span = document.querySelector('#debugmsg');
    this.span.style.display = 'inline';
    //this.span.style.position = 'absolute';
    this.span.style.left = '5px';
    this.span.style.bottom = '5px';
}

MessageBox.prototype = {
    constructor: MessageBox,
    appendMessage: function(msg) {
        this.span.innerHTML = this.span.innerHTML + '<br />' + msg;
    },

    clear: function() {
        this.span.textContent = '';
    }
}