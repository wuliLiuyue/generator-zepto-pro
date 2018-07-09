/**
 * getAndroidVersion(); //"4.2.1"
 * parseInt(getAndroidVersion(), 10); //4
 * parseFloat(getAndroidVersion()); //4.2
 */

export function getAndroidVersion(ua) {
  ua = ( ua || navigator.userAgent ).toLowerCase();
  let match = ua.match(/android\s*([0-9\.]*)/i);
  return match ? match[1] : false;
}

/**
 * getAppVersion
 * @return {object} app
 *    @return {string} app.platform 平台名 ios / android
 *    @return {string} app.version app版本号
 */

export function getAppVersion(ua) {
  ua = ( ua || navigator.userAgent ).toLowerCase();

  let platform = ua.match(/android\s*([0-9\.]*)/i) ? 'android' : 'ios';

  let versionMatch = ua.match(/KaiKeLa\/([0-9\.]*)/i);
  let version = versionMatch ? versionMatch[1] : '';

  return { platform, version };
}
