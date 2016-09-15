var userAccess =  ["ali.ikram"];



/* Don't touch the following if you don't know what are you doing */

module.exports = {
userAccess: userAccess,
oc: function oc(a)
{
  var o = {};
  for(var i=0;i<a.length;i++)
  {
    o[a[i]]='';
  }
  return o;
}
};