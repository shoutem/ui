export const DEFAULT_PROGRESS_COLORS = [
  '#FF0000', // Red
  '#FF4500', // Orange-Red
  '#FFA500', // Orange
  '#FFD700', // Yellow
  '#ADFF2F', // Yellow-Green
  '#90EE90', // Light Green
];

export const PROGRESS_RING_DEFAULT_PROPS = {
  progressLineWidth: 10,
  backgroundLineWidth: 10,
  progressLineCap: 'round',
  backgroundLineCap: 'round',
  progressPercentage: 0.1, // 0.1 so that it shows tiny fill indicator, indicating 0%, better UX/UI than empty.
  arcSweepAngle: 360,
  size: 80,
  color: '#000',
};
