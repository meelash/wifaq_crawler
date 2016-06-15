var
  landmarks = {
    name: {
      preStr: 'z-index:25;top:55px;left:663px;width:341px;height:38px;text-align:right;"><span align="right" class="fci5kcrymfzw0-0"> ',
      postStr: ' </span></div>'
    },
    address: {
      preStr: 'z-index:25;top:100px;left:713px;width:296px;height:33px;text-align:right;"><table width="296px" border="0" cellpadding="0" cellspacing="0"><td align="right"><span class="fci5kcrymfzw0-1"> ',
      postStr: ' </span></td></table></div>'
    },
    province: {
      preStr: 'z-index:25;top:134px;left:786px;width:222px;height:32px;text-align:right;"><span align="right" class="fci5kcrymfzw0-2">',
      postStr: '</span></div>'
    }
};

var findIdx = (txt, type, isPre) => {
  var searchStr = landmarks[type][isPre ? 'preStr' : 'postStr'];
  var strIdx = txt.indexOf(searchStr);
  return isPre ? strIdx + searchStr.length : strIdx;
}  

exports.getName = (pageTxt) => {
  var startIdx = findIdx(pageTxt, 'name', true);
  var rest = pageTxt.substr(startIdx);
  var endIdx = findIdx(rest, 'name', false);
  return pageTxt.substr(startIdx, endIdx);
}

exports.getAddress = (pageTxt) => {
  var startIdx = findIdx(pageTxt, 'address', true);
  var rest = pageTxt.substr(startIdx);
  var endIdx = findIdx(rest, 'address', false);
  return pageTxt.substr(startIdx, endIdx);
}

exports.getProvince = (pageTxt) => {
  var startIdx = findIdx(pageTxt, 'province', true);
  var rest = pageTxt.substr(startIdx);
  var endIdx = findIdx(rest, 'province', false);
  return pageTxt.substr(startIdx, endIdx);
}