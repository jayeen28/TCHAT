/**
 * This function is used for managing chat rooms.
 * @param {Object} Data The data comes with room event.  
 * @param {Object} socket The socket instance.
 * @param {Function} back This function is used for sending back event replies.
 * @returns {void} returns nothing.
 */
const room = async ({ roomId = undefined, action = 'join' }, socket, back) => {
    try {
        if (!roomId) throw new Error('No room id found');
        if (action === 'exit') {
            socket.leave(roomId);
            return back('room', { roomId, action })
        };
        /**
         * If user tries to join new room then remove him from previous rooms
         */
        [...socket.adapter.rooms].forEach(([k, v]) => { v.has(socket.id); socket.leave(k) });
        /**
         * Let's join
         */
        socket.join(roomId.toString());
        back('room', { roomId, action });
    }
    catch (e) { console.log(e) }
};

module.exports = room;