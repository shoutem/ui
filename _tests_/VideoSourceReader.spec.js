import { assert } from 'chai';
import VideoSourceReader from '../components/Video/VideoSourceReader';

describe('VideoSource', () => {
  describe('YouTube source', () => {
    const testSource = 'https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1';
    const videoSourceReader = new VideoSourceReader(testSource);
    describe('isWebVideo', () => {
      it('returns true', () => {
        const expected = true;
        assert.equal(videoSourceReader.isEmbeddableVideo(), expected, 'web video not recoginized');
      });
    });
    describe('getUrl', () => {
      it('returns an embedded YouTube video url', () => {
        const expected = 'https://www.youtube.com/embed/M7lc1UVf-VE';
        assert.equal(videoSourceReader.getUrl(), expected, 'video url not correct');
      });
    });
  });

  describe('Vimeo source', () => {
    const testSource = 'https://player.vimeo.com/video/122732445';
    const videoSourceReader = new VideoSourceReader(testSource);
    describe('isEmbeddableVideo', () => {
      it('returns true', () => {
        const expected = true;
        assert.equal(videoSourceReader.isEmbeddableVideo(), expected, 'web video not recoginized');
      });
    });
    describe('getUrl', () => {
      it('returns an embedded YouTube video url', () => {
        const expected = 'https://player.vimeo.com/video/122732445?title=0&byline=0&portrait=0';
        assert.equal(videoSourceReader.getUrl(), expected, 'video url not correct');
      });
    });
  });

  describe('Non web video source', () => {
    const testSource = 'https://falcon479.startdedicated.com/files/round_boxes.mp4';
    const videoSourceReader = new VideoSourceReader(testSource);
    describe('isEmbeddableVideo', () => {
      it('returns false', () => {
        const expected = false;
        assert.equal(videoSourceReader.isEmbeddableVideo(), expected, 'web video recoginized incorrectly');
      });
    });
    describe('getUrl', () => {
      it('returns unmodified source url', () => {
        const expected = 'https://falcon479.startdedicated.com/files/round_boxes.mp4';
        assert.equal(videoSourceReader.getUrl(), expected, 'video url not correct');
      });
    });
  });
});
