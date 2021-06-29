export default function isValidVideoFormat(url) {
  if (url.includes('.3gp') || url.includes('.ogv') || url.includes('.webm')) {
    return false;
  }

  return true;
}
