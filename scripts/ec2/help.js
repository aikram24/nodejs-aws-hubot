module.exports = function(robot) {
  return robot.respond(/ec2 help(.*)$/i, function(msg) {
    var helpMessage = "*EC2 Help Menu:* \n"
    helpMessage += "*ls* \*\*\*        		      : Returns info about all instances. \n"
    helpMessage += "*ls --instance_id=* \*\*\*        : [optional] The id of an instance. If omit it, returns info about all instances. \n"
    helpMessage += "*ls --instance_filter=* \*\*\*    : [optional] The name of an instance. If omit it, returns info about all instance \n"
    helpMessage += "*ami ls* \*\*\*    		      : Returns info about all AMIs \n"
    helpMessage += "*ami ls ----owner=* \*\*\*        : [optional] The owner of an AMI. If omit it, returns info about all AMIs. \n"
  return msg.send(helpMessage);

  });

};
