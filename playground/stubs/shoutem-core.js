// The playground runs on web, matching @shoutem/ui's own Platform checks.
export const isWeb = true;
export const isIos = false;
export const isAndroid = false;
export const isProduction = () => true;
export default { isWeb, isIos, isAndroid };
