import qs from 'qs';
import { Toast } from 'vant';

// import { onLoadedHandeFn } from "./onloadTaocheScheme";
// const setTitle = onLoadedHandeFn(_setTitle);
// const addRightBarButton = onLoadedHandeFn(_addRightBarButton);
console.log(process.env);
// 环境判断：uat 还是 线上
const isUAT =
  location.href.indexOf('://uat.store.') !== -1 ||
  process.env.NODE_ENV === 'development';
const baseApiUrl = isUAT
  ? 'https://p-api-test.taoche.cn/'
  : 'https://p-api.taoche.cn/';
const baseImgUrl = isUAT
  ? 'https://img5.taoche.cn/taoche/mendian-test/'
  : 'http://img5.taoche.cn/taoche/mendian/';
const baseUrl = isUAT ? 'http://uat-crm.taoche.com/v-api/' : 'https://crm.taoche.com/v-api/'; // 涛涛和鹏志做企业微信的时候用的

const apiurl = `${baseApiUrl}v1/`; // api地址(原生传的是 baseApiUrl)
const imgurl = `${baseImgUrl}car/pc/`; // 图片地址
const basePageUrl =
  process.env.NODE_ENV === 'development'
    ? `${location.origin}/#/`
    : `${location.origin}/h5.html/#/`;
/**
 * 获取页面路径参数
 * @param {*} url 页面路径
 * @returns 所有值得对象
 */
const getParams = url => {
  const search = url || window.location.hash.split('?')[1];
  const Obj = qs.parse(search);
  return Obj;
};

/**
 * 获取页面路径参数
 * 注：参数不区分大小写，PArams===params
 * @param {*} params 需要查询的字段
 * @param {*} url 页面路径
 * @returns 字段值 || 所有值得对象
 */
const getQueryParams = (params, url) => {
  const Obj = getParams(url);
  for (var key in Obj) {
    Obj[key.toLowerCase()] = Obj[key];
  }
  if (params) {
    return Obj[params.toLowerCase()];
  }
  return Obj;
};

const getSource = () =>
  getQueryParams('requestSource') && getQueryParams('requestSource') > 1;
// 判断环境(true:小马达webview)
let source = getSource();
const setSource = s => (source = s);

/**
 * 获取入口参数
 * @returns 原生打开h5页面时传递过来的参数
 */
const getEntryParams = () => {
  let params = getQueryParams();
  if (!source) {
    // 原生不走这一步
    params = {
      authorization: '02eb602e733e40ad83f9835cf44c94b2',
      ...params,
    };
  }
  params.apiurl = apiurl; // api地址
  params.imgurl = imgurl; // 图片地址
  return params;
};

// 解析search query 比如路径为:https://store.taoche.com/h5.html/?code=YEaRGIFAEvYLfu-W0y3UnAx10d4BCQZ8cGRY-oCZC6Y&state=aistore#/customer-flow/statistics?tabsTarget=1
const parseQueryFromSearch = function() {
  let o = {};
 const test="appid=wwa5bfb8f102dad85f&redirect_uri=https://store.taoche.com/h5.html?tabsTarget=1#/wxwork/login&response_type=code&scope=snsapi_base&state=aistore#wechat_redirect"
  let queryString = test.split('?')[1];
  if (queryString) {
    queryString.split('&').forEach(item => {
      let [key, val] = item.split('=');
      val = val ? decodeURI(val) : true;
      // 转码无值赋值true
      if (o.hasOwnProperty(key)) {
        //   已有属性转为数组
        o[key] = [].concat(o[key], val);
      } else {
        o[key] = val;
      }
    });
  }
  return o;
};

// 判断系统环境是否是IOS
const ISIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

// 判断是企业微信
const ISQYWX = (function() {
  var ua = window.navigator.userAgent.toLowerCase();
  if (
    ua.match(/MicroMessenger/i) == 'micromessenger' &&
    ua.match(/wxwork/i) == 'wxwork'
  ) {
    return true;
  }
  return false;
})();

// 判断是对象
const isObject = obj =>
  Object.prototype.toString.call(obj) === '[object Object]';

// 转换方法
const transfor = {
  // js版：像素转rem
  px2rem: px => {
    const fontSize = parseFloat(document.documentElement.style.fontSize);
    return px / fontSize;
  },
  // 时间格式化(兼容moment.js传参方式)
  TimeFormater: Format => {
    const handleFn = (time, formate) => {
      let datetime = null;
      if (typeof time === 'string') {
        time = time.replace(/-/gi, '/'); // 兼容ios
        if (!Number.isNaN(new Date(time).getTime())) {
          datetime = new Date(time);
        }
      }
      if (typeof time === 'number' && time > 0) {
        datetime = new Date(time);
      }
      if (typeof time === 'object' && time !== null && time.getTime) {
        datetime = time;
      }
      if (!datetime) return;
      const year = datetime.getFullYear();
      const MONTH = datetime.getMonth();
      const DATE = datetime.getDate();
      const HOUSE = datetime.getHours();
      const MINUTE = datetime.getMinutes();
      const SECOND = datetime.getSeconds();
      const dateObj = {
        YYYY: year,
        MM: MONTH + 1 < 10 ? `0${MONTH + 1}` : MONTH + 1,
        DD: DATE < 10 ? `0${DATE}` : DATE,
        HH: HOUSE < 10 ? `0${HOUSE}` : HOUSE,
        mm: MINUTE < 10 ? `0${MINUTE}` : MINUTE,
        ss: SECOND < 10 ? `0${SECOND}` : SECOND,
      };
      const result = (formate || 'YYYY-MM-DD HH:mm:ss').replace(
        /(YYYY)|(MM)|(DD)|(HH)|(mm)|(ss)/gi,
        matchStr => dateObj[matchStr]
      );
      return result;
    };
    // 正常使用时：fn=TimeFormater("YYYY-MM-DD")(1627836378216378) === "2019-12-12"
    // 正常使用时：fn=TimeFormater("YYYY-MM-DD")("2020-12-12 12:12:12") === "2020-12-12"
    // 正常使用时：fn=TimeFormater("YYYY-MM-DD")(new Date()) === "2020-12-12"
    // 正常使用时：fn=TimeFormater("YYYY-MM-DD")() === undefined
    // 正常使用时：fn=TimeFormater()("2020/12/12 12:12:12") === "2020-12-12 12:12:12"
    const Fn = time => handleFn(time, Format);
    // 按照moment.js使用时：fn=TimeFormater(1627836378216378).format("YYYY-MM-DD") === "2019-12-12"
    // 按照moment.js使用时：fn=TimeFormater("2020-12-12 12:12:12").format("YYYY-MM-DD") === "2019-12-12"
    // 按照moment.js使用时：fn=TimeFormater(new Date()).format("YYYY-MM-DD") === "2019-12-12"
    // 按照moment.js使用时：fn=TimeFormater().format("YYYY-MM-DD") ===undefined
    // 按照moment.js使用时：fn=TimeFormater("2020/12/12 12:12:12").format() ==="2020-12-12 12:12:12"
    Fn.format = Format1 => handleFn(Format, Format1);
    return Fn;
  },
  // 判断数值是否有效，null undefined 代表没操作过，0代表用户实际输入过
  effectiveNumber: value => (value || value === 0) && !isNaN(Number(value)),
  // 元转化为万元,公里转万公里
  RMBConversion: value => {
    if (transfor.effectiveNumber(value)) {
      return (value / 10000).toFixed(2);
    } else {
      return '-';
    }
  },
  //格式化货币单位为整数元
  PriceFormat: value => {
    if (transfor.effectiveNumber(value)) {
      return parseInt(value);
    } else {
      return '-';
    }
  },
  //格式化保留2位小数
  formatDecimal: (value, rtValue = '-') => {
    if (transfor.effectiveNumber(value)) {
      return Math.round(parseFloat(value) * 100) / 100;
    } else {
      return rtValue;
    }
  },
  // 格式换强制保留两位小数
  formatTwoDecimal(value, rtValue = '-') {
    if (transfor.effectiveNumber(value)) {
      var f = Math.round(value * 100) / 100;
      var s = f.toString();
      var rs = s.indexOf('.');
      if (rs < 0) {
        rs = s.length;
        s += '.';
      }
      while (s.length <= rs + 2) {
        s += '0';
      }
      return s;
    } else {
      return rtValue;
    }
  },
  // 对象拼接为url search
  urlString: obj =>
    Object.keys(obj)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
      .join('&'),
  // 筛选状态拼接上 “不限” {[label:text,code:status]}
  getSelectFromDict: obj => {
    const arr = [
      {
        key: '',
        value: '不限',
      },
    ];
    return arr.concat(
      obj.map(item => {
        return {
          key: item.code,
          value: item.label,
        };
      })
    );
  },
};

/**
 * 绑定字段,最基本的判断字段是否为 空，0是有意义的直接返回
 * @param {*} value 字段值
 * @returns 字段值 || -
 */
const setField = value => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  return value;
};

/**
 * 绑定字段(一般用于详情页)
 * setField(detail.a)???,NO!
 * setFieldFactory(detail)(a)
 * @param {*} detail
 */
const setFieldFactory = detail => field => setField(detail[field]);

/**
 * 对于金钱的处理，有时需要将 0 转为 ”-“
 * @param {*} value 字段值
 * @returns
 */
const getPriceField = value => {
  if (Number(value) === 0) {
    return '-';
  }
  return setField(value);
};

/**
 * 从模板字符串中删除undefined,null
 * @param {*} str
 * @returns
 */
const delVoildFieldFromStr = function(str) {
  str = setField(`${str}`);
  return str.replace(/(undefined)|(null)/gi, '-');
};

/**
 * 检查图片是否是全路径形式
 * @param {*} src 图片路径
 * @returns 具备 完整域名的 url
 */
const checkImgHttpFn = function(src) {
  if (!`${src}`.match(/\/\/img[\d]?\.taoche\.cn/gi)) {
    return imgurl + src;
  }
  return src;
};

/**
 * 获取(轮播)图片
 * @param {*} vehiclePhoto 头图
 * @param {*} vehiclePhotoList 车源图片
 * @returns 具备完整域名的  图片数组
 */
const getSwiperPics = function(vehiclePhoto, vehiclePhotoList) {
  // 头图 + 轮播图
  let arr = [];
  if (vehiclePhoto) {
    arr.push(checkImgHttpFn(vehiclePhoto));
  }
  if (Array.isArray(vehiclePhotoList)) {
    arr = arr.concat(
      vehiclePhotoList.filter(v => v && !!v.trim()).map(v => checkImgHttpFn(v))
    );
  }
  return arr;
};

/**
 * 从 返回数据对象中 取出 pic开头的字段
 * @param {*} res respones data对象
 * @returns 图片数组
 */
const getPicsFromRes = function(data) {
  let arr = [];
  if (isObject(data)) {
    var reg = /^pic\d/;
    for (var item in data) {
      if (reg.test(item)) {
        if (data[item]) {
          arr.push(data[item]);
        }
      }
    }
  }
  return arr;
};

/**
 * 对象转换空字符串（""==>null）,用于接口返回值不规范，有的返回null,有的""
 * @param {*} obj 一般为response
 * @param {*} type deep 是否多遍历一层
 * @returns
 */
const handleObjVoid = function(obj, type) {
  function setField(value) {
    if (value === '') {
      return null;
    }
    return value;
  }
  const NewObj = {};
  for (let key of Object.keys(obj)) {
    const val = obj[key];
    if (type === 'deep' && isObject(val)) {
      // 再多遍历一层
      const newObj1 = {};
      for (let key1 of Object.keys(val)) {
        newObj1[key1] = setField(val[key1]);
      }
      NewObj[key] = newObj1;
    } else {
      NewObj[key] = setField(val);
    }
  }
  return NewObj;
};

/**
 * 对sessionStorage拦截一层，好做统一处理
 */
const session = {
  setItem(key, value) {
    if (typeof value === 'object' && value !== null) {
      sessionStorage.setItem(key, JSON.stringify(value));
    } else {
      sessionStorage.setItem(key, value);
    }
  },
  getItem(key) {
    try {
      return JSON.parse(sessionStorage.getItem(key));
    } catch {
      return sessionStorage.getItem(key);
    }
  },
  removeItem(key) {
    if (key) {
      sessionStorage.removeItem(key);
    }
  },
  clear() {
    sessionStorage.clear();
  },
  // 定义拼装参数
  name: {
    params: '|params', // 列表查询参数
    scrollTop: '|scrollTop', // 列表滚动到的位置
  },
};

/**
 * 对localStorage拦截一层，好做统一处理
 * 增加过期限制：token + 过期时间
 * 更新缓存：1.等时间过期，2.重新登录
 * expiresTime 过期时间(默认0点更新)
 */
const local = {
  setItem(
    key,
    value,
    expiresTime = +new Date() + (24 - new Date().getHours()) * 3600 * 1000
  ) {
    localStorage.setItem(
      key,
      JSON.stringify({
        authorization: getEntryParams().authorization,
        expiresTime,
        value,
      })
    );
  },
  getItem(key) {
    const rs = localStorage.getItem(key);
    if (!rs) return null;
    try {
      const data = JSON.parse(rs);
      if (isObject(data)) {
        if (
          data.authorization !== getEntryParams().authorization ||
          data.expiresTime <= +new Date()
        ) {
          localStorage.removeItem(key);
          return null;
        }
        return data.value;
      }
    } catch (err) {
      return rs;
    }
  },
  removeItem(key) {
    if (key) {
      localStorage.removeItem(key);
    }
  },
  clear() {
    localStorage.clear();
  },
};

/**
 * 获取字典数据，使用缓存，减少请求
 * 注：基本可以认为，没有查询参数（或者参数写死）的ajax都是“字典数据”，所以有动态参数的请求就别用此方法！！！
 * @param {*} key 存储的key
 * @param {*} promiseAjax axios请求
 * @returns response || {}
 * 升级：使用local,过期时间30天
 */
async function getZiDianAjax(key, promiseAjaxFn) {
  if (typeof promiseAjaxFn !== 'function') {
    throw 'getZiDianAjax的参数：promiseAjaxFn 必须为function';
  }
  if (!key) {
    return {};
  }
  const localRes = local.getItem(key);
  if (localRes) {
    // 给个延时，这样loading不会闪
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(localRes);
      }, 300);
    });
  }
  const res = await promiseAjaxFn();
  if (res.code === 0 || res.code === 1 || res.code === 200 || res.ok) {
    // 过期时间是30天
    local.setItem(key, res, +new Date() + 30 * 24 * 3600 * 1000);
  }
  // 完全透传，不做任何处理
  return res || {};
}

/**
 * 数组二维变一维，展开一层数组
 * @param {*} arr
 */
const arrFlat = arr => [].concat(...arr);

/**
 * 手机端:判断各个平台浏览器及操作系统平台
 * @returns
 */
function checkPlatform() {
  const ua = navigator.userAgent.toLowerCase();
  const msg = {};
  if (/android/i.test(navigator.userAgent)) {
    const test = /android\s([\w.]+)/; //IE
    const match = test.exec(ua);
    const version = match[1].split('.')[0];
    msg.android = version;
  }
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    const test = /os\s([\w_]+)/; //IE
    const match = test.exec(ua);
    const version = match[1].split('_')[0];
    msg.ios = version;
  }
  if (/MicroMessenger/i.test(navigator.userAgent)) {
    msg.wx = true;
  }
  return msg;
}

// 设置蒙层
const setOverlay = function() {
  const div = document.createElement('div');
  div.style = 'position:fixed;top:0;right:0;bottom:0;left:0;z-index:10000;';
  document.body.appendChild(div);
  return function removeOverlay() {
    div.parentNode && div.parentNode.removeChild(div);
  };
};

/**
 * 判断文件类型，是图片还是视频
 * @param {*} filePath 文件路径
 */
const checkFileType = filePath => {
  if (typeof filePath !== 'string') {
    console.error('文件路径：请传入字符串');
    return {};
  }
  const hasQuery = filePath.indexOf('?');
  if (hasQuery !== -1) {
    filePath = filePath.slice(0, hasQuery);
  }
  const index = filePath.lastIndexOf('.');
  if (index === -1) {
    console.error('文件路径不规范，' + filePath);
    return {};
  }
  const type = filePath.slice(index + 1).toLowerCase();
  switch (type) {
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'bmp':
      return {
        img: true,
      };
    case 'mp4':
    case 'avi':
    case 'rmvb':
    case 'ts':
      return {
        video: true,
      };
    case 'pdf':
      return {
        pdf: true,
      };
    default:
      return {};
  }
};

export {
  arrFlat, // 数组二维变一维，展开一层数组
  baseApiUrl, // 接口域名
  baseImgUrl, // 图片域名
  baseUrl,//
  basePageUrl,
  checkImgHttpFn, // 检查图片是否是全路径形式
  checkPlatform, // 手机端:判断各个平台浏览器及操作系统平台
  checkFileType, // 判断文件类型，是图片还是视频
  // copyToClipBoard, // 小马达设置复制内容到剪切板
  delVoildFieldFromStr, // 从模板字符串中删除undefined,null
  // goback, // 小马达页面返回
  // goreplace, // 小马达 history replace方法
  // goUrlAsOutPath, // 跳转外部链接,比如 https://www.baidu.com/
  // gopageAsOutPath, // 跳转外部链接,比如 https://www.baidu.com/
  // goUrlAsPath, // 小马达h5页面跳转
  // goPageAsPath, // 小马达gopage页面跳转
  // gopageAsWeixin, // 跳转微信（点击微信图标）
  getSwiperPics, // 获取(轮播)图片
  getSource, // 获取source
  setSource, // 获取source
  getPicsFromRes, // 从 返回数据对象中 取出 pic开头的字段
  getParams, // 获取页面路径参数,hash值?之后的传参
  getEntryParams, // 获取入口参数,原生打开h5页面时传递过来的参数
  getQueryParams, // 获取页面路径参数,参数不区分大小写，PArams===params
  getPriceField, // 对于金钱的处理，有时需要将 0 转为 ”-“
  getZiDianAjax, //  获取字典数据，使用缓存，减少请求
  handleObjVoid, // 对象转换空字符串（""==>null）,用于接口返回值不规范，有的返回null,有的""
  // photobrowser, // 查看图片
  isUAT, // 环境判断：uat 还是 线上
  isObject, // 判断是对象
  ISQYWX, // 判断是企业微信
  ISIOS, // 判断系统环境是否是IOS
  local, // 对localStorage拦截一层，好做统一处理
  parseQueryFromSearch, // 从search中获取传参
  session, // 对sessionStorage拦截一层，好做统一处理
  source, // 判断环境(true:小马达webview)
  // showPic, // 小马达原生图片查看
  setField, // 绑定字段
  setFieldFactory, // 绑定字段(用于详情)
  // setTitle, // 小马达 设置title
  setOverlay, // 设置蒙层
  transfor, // 转换方法
  // photoUpload,
  // videoUpload,
  // photoUploadTaoCheJian,
  // logout,
  // addRightBarButton,
  // audiobrowser,
  // weChatAuth,
};
