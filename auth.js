module.exports = {
  canAccess: function(robot, user) {
    var role;
    if (process.env.HUBOT_AWS_DEBUG) {
      return true;
    }
    if (robot.auth.isAdmin(user)) {
      return true;
    }
    role = process.env.HUBOT_AWS_CAN_ACCESS_ROLE;
    if (role && robot.auth.hasRole(user, role)) {
      return true;
    } else {
      return false;
    }
  }
};