var getArgParams, moment, tsv;
moment = require('moment');
tsv = require('tsv');
var common = require('../common/common.js');

getArgParams = function(arg) {
  var owner, owner_capture;
  owner_capture = /--owner=(.*?)( |$)/.exec(arg);
  owner = owner_capture ? owner_capture[1] : 'self';
  return {
    owner: owner
  };
};

module.exports = function(robot) {
  return robot.respond(/ec2 ami ls(.*)$/i, function(msg) {
var userAccess= common.userAccess;
 if (msg.message.user.name in common.oc(userAccess)) {
    var arg_params, aws, ec2, owner;
    msg.send("Fetching ...");
    aws = require('../../aws.js').aws();
    ec2 = new aws.EC2({
      apiVersion: '2014-10-01'
    });
    arg_params = getArgParams(msg.match[1]);
    owner = arg_params.owner;
    return ec2.describeImages({
      Owners: [owner]
    }, function(err, res) {
      var data, i, j, len, len1, message, messages, name, ref, ref1, tag;
      if (err) {
        return msg.send("Error: " + err);
      } else {
        messages = [];
        ref = res.Images;
        for (i = 0, len = ref.length; i < len; i++) {
          data = ref[i];
          name = '[NoName]';
          ref1 = data.Tags;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            tag = ref1[j];
            if (tag.Key === 'Name') {
              name = tag.Value;
            }
          }
          messages.push({
            time: moment(data.CreationDate).format('YYYY-MM-DD HH:mm:ssZ'),
            ami_id: data.ImageId,
            owner: data.OwnerId,
            "public": data.Public,
            status: data.State,
            root_device: data.RootDeviceType,
            virtualization_type: data.VirtualizationType,
            ami_name: data.Name,
            name: name
          });
        }
        messages.sort(function(a, b) {
          return moment(a.time) - moment(b.time);
        });
        message = tsv.stringify(messages) || '[None]';
        return msg.send(message);
      }
    });
} else {
     msg.send("You cannot access this feature. Please contact with admin");
}
  });
};