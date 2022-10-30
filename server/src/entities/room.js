const room = async ({ roomId = undefined, action = 'join' }, socket, back) => {
    try {
        if (!roomId) throw new Error('No room id found');
        if (action === 'exit') {
            socket.leave(roomId);
            return back('room', { roomId, action })
        };
        if (socket.adapter?.rooms?.has(roomId)) return back('error', { message: 'room already exists' })
        socket.join(roomId.toString());
        back('room', { roomId, action }, socket);
    }
    catch (e) { console.log(e) }
};

module.exports = room;