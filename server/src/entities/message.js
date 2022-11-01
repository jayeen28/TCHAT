const message = async ({ roomId, message }, socket, back) => {
    try {
        const rooms = socket.adapter.rooms;
        if (![...rooms.keys()].includes(roomId) || ![...rooms].some(([k, v]) => k !== socket.id && v.has(socket.id))) return back('error', { message: 'Something went wrong.' });
        socket.to(roomId).emit("message", message);
    }
    catch (e) {
        console.log(e)
    }
};

module.exports = message;