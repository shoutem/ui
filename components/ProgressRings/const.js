export const DEFAULT_PROGRESS_COLORS = [
  '#FF0000', // Red
  '#FF4500', // Orange-Red
  '#FFA500', // Orange
  '#FFD700', // Yellow
  '#ADFF2F', // Yellow-Green
  '#90EE90', // Light Green
];

export const PROGRESS_RING_DEFAULT_PROPS = {
  width: 10,
  backgroundWidth: 10,
  progressLineCap: 'round',
  backgroundLineCap: 'round',
  percentage: 0.1, // 0.1 so that it shows tiny fill indicator, indicating 0%, better UX/UI than empty.
  arcSweepAngle: 360,
  size: 80,
  hasBackgroundColor: true,
  color: '#000',
};
