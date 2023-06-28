const users = [];

function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

function getCurrentUser(id) {
  const user = users.find((user) => user.id === id);

  return user;
}

function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index != -1) {
    return users.splice(index,1)[0];
  }
}

function getRoomUsers(room) {
    const roomUsers = users.filter((user) => user.room === room);
    console.log(roomUsers)
    return roomUsers
}

module.exports = { userJoin, getCurrentUser, userLeave,getRoomUsers };
