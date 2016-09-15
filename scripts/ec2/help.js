module.exports = function(robot) {
  return robot.respond(/ec2 help(.*)$/i, function(msg) {
    var helpMessage = "*EC2 Help Menu:* \n"
    helpMessage += "*--instance_id=* \*\*\*        : [optional] The id of an instance. If omit it, returns info about all instances. \n"
    helpMessage += "*--instance_filter=* \*\*\*    : [optional] The name of an instance. If omit it, returns info about all instance \n"
  return msg.send(helpMessage);

  });

};
