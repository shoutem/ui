import createIcon from './createIcon';

const RubiconIcon = createIcon('rubicon-icon-font');

const icons = {
  Default: null,
  Fallback: RubiconIcon,
};

function setDefaultIconFont(fontFamily) {
  icons.Default = fontFamily
}

function Icon(props) {
  const DefaultIcon = icons.Default || icons.Fallback;
  return <DefaultIcon {...props} />
}

export {
  Icon,
  createIcon,
  setDefaultIconFont,
}
