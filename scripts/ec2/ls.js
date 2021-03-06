// Description:
//  List ec2 instances info
//   Show detail about an instance if specified an instance id
////   Filter ec2 instances info if specified an instance name

// Commands:
//  hubot ec2 ls - Displays Instances

// Notes:
//   --instance_id=***     : [optional] The id of an instance. If omit it, returns info about all instances.
//   --inst



var getArgParams,
    moment,
    tsv,
    util;

moment = require('moment');
util = require('util');
tsv = require('tsv');
var common = require('../common/common.js');

getArgParamsFunc = function(arg) {
  var ins_id_capture = /--instance_id=(.*?)( |$)/.exec(arg);
  var ins_id = ins_id_capture ? ins_id_capture[1] : '';
  var ins_filter_capture = /--instance_filter=(.*?)( |$)/.exec(arg);
  var ins_filter = ins_filter_capture ? ins_filter_capture[1] : '';
  return {
    ins_id: ins_id,
    ins_filter: ins_filter
  };
};


module.exports = function(robot) {
  return robot.respond(/ec2 ls(.*)$/i, function(msg) {
var userAccess= common.userAccess;
 if (msg.message.user.name in common.oc(userAccess)) {
    // msg.send(msg.message.user.name);
    var arg_params = getArgParamsFunc(msg.match[1]);
    var ins_id = arg_params.ins_id;
    var ins_filter = arg_params.ins_filter;
    var aws = require('../../aws.js').aws();
    var ec2 = new aws.EC2({apiVersion: '2014-10-01'});
var msg_txt = "Fetching " + (ins_id || 'all (instance_id is not provided)');
 if (ins_filter) {
   msg_txt += " containing '" + ins_filter + "' in name";
 }
 msg_txt += "...";
 msg.send(msg_txt);

return ec2.describeInstances((ins_id ? {InstanceIds: [ins_id]} : null), function(err, res) {
  var data, i, ins, j, len, len1, message, messages, name, ref, ref1, tag;
  if (err) {
          return msg.send("DescribeInstancesError: " + err);
        } else {
          messages = [];
          ref = res.Reservations;
          for (i = 0, len = ref.length; i < len; i++) {
            data = ref[i];
            ins = data.Instances[0];
            name = '[NoName]';
            ref1 = ins.Tags;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              tag = ref1[j];
              if (tag.Key === 'Name') {
                name = tag.Value;
              }
            }
            if (ins_filter && name.indexOf(ins_filter) === -1) {
              continue;
            }



            messages.push({

              /* time: moment(ins.LaunchTime).format('YYYY-MM-DD HH:mm:ssZ'),*/
              state: ins.State.Name,
              id: ins.InstanceId,
              image: ins.ImageId,
              az: ins.Placement.AvailabilityZone,
              subnet: ins.SubnetId,
              type: ins.InstanceType,
              ip: ins.PrivateIpAddress,
              name: name || '[NoName]'
            });
          }
          messages.sort(function(a, b) {
            return moment(a.time) - moment(b.time);
          });
          message = tsv.stringify(messages) || '[None]';
          /* return msg.send(message); */
          return msg.send("```" + message + "```");
        }

          });
} else {
     msg.send("You cannot access this feature. Please contact with admin");
}
        });
}