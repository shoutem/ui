function getYouTubeVideoId(url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\??v?=?))([^#&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[7].length === 11) {
    return match[7];
  }

  return false;
}

function getVimeoVideoId(url) {
  // TODO(Vladimir) - find a shorter regex that covers all of our usecases, remove eslint-disable
  // The eslint line length rule is disabled so we can use our old battle-tested regex for vimeo
  const regExp = /https?:\/\/(?:[\w]+\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/; // eslint-disable-line max-len
  const match = url.match(regExp);

  if (match && match[3]) {
    return match[3];
  }

  return false;
}

function getYouTubeEmbedUrl(id) {
  return `http://www.youtube.com/embed/${id}`;
}

function getVimeoEmbedUrl(id) {
  return `http://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0`;
}

/**
 * Reads the video source and provides the video
 * url in embedded form if necessary
 */
export default class VideoSourceReader {
  constructor(source) {
    this.source = source;
    this.isYouTube = !!getYouTubeVideoId(source);
    this.isVimeo = !!getVimeoVideoId(source);
  }

  isWebVideo() {
    return this.isYouTube || this.isVimeo;
  }

  getUrl() {
    if (this.isYouTube) {
      return getYouTubeEmbedUrl(getYouTubeVideoId(this.source));
    } else if (this.isVimeo) {
      return getVimeoEmbedUrl(getVimeoVideoId(this.source));
    }

    return this.source;
  }
}
