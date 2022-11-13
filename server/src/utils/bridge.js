const { func, obj } = require("./defaultValues");

function bridge(socket) {
    return ({
        go: async function (handler = func, data = obj) {
            try { handler(data, socket, this.back) }
            catch (e) { this.error(e) }
        },
        back: async function (ev = '', data = obj) {
            try { socket.emit(ev, data) }
            catch (e) { this.error(e) }
        },
        error: function (e) {
            console.log(e);
            socket.emit('error', { message: "something went wrong" })
        }
    })
};

module.exports = bridge;