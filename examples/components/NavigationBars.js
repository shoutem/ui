import React from 'react';
import { Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import { Heading, Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { DropDownMenu } from '../../components/DropDownMenu';
import { Icon } from '../../components/Icon';
import { ImageBackground } from '../../components/ImageBackground';
import { NavigationBar } from '../../components/NavigationBar';
import { View } from '../../components/View';
import { Device } from '../../helpers/device-selector.js';
import {
  NAVIGATION_HEADER_HEIGHT,
  IPHONE_X_NOTCH_PADDING,
  IPHONE_XR_NOTCH_PADDING,
} from '../../const';
import { Stage } from './Stage';

const window = Dimensions.get('window');

function NavBarStageContainer(props) {
  const { style } = props;

  return (
    <View
      {...props}
      style={{
        width: window.width,
        height: Device.select({
          iPhoneX: NAVIGATION_HEADER_HEIGHT + IPHONE_X_NOTCH_PADDING,
          iPhoneXR: NAVIGATION_HEADER_HEIGHT + IPHONE_XR_NOTCH_PADDING,
          default: NAVIGATION_HEADER_HEIGHT,
        }),
        ...style,
      }}
    />
  );
}

NavBarStageContainer.propTypes = {
  style: PropTypes.object,
};

NavBarStageContainer.defaultProps = {
  style: {},
};

export function NavigationBars() {
  const navBarDropDownOptions = [
    { name: 'All', value: 1 },
    { name: 'Sport', value: 1 },
    { name: 'World', value: 1 },
    { name: 'Lifestyle', value: 1 },
    { name: 'Food', value: 1 },
    { name: 'Music', value: 1 },
    { name: 'Movies', value: 1 },
    { name: 'Tech', value: 1 },
    { name: 'Fun', value: 1 },
    { name: 'Fashion', value: 1 },
  ];
  const navBarDropDownSelectedOption = navBarDropDownOptions[0];

  return (
    <View styleName="vertical collapsed">
      <Stage title="Navbar / Solid">
        <NavBarStageContainer>
          <NavigationBar
            title="TITLE"
            style={{ backgroundColor: 'red' }}
          />
        </NavBarStageContainer>
      </Stage>
      <Stage title="Navbar / Clear (Solid color)">
        <View style={{ backgroundColor: '#1a70d5' }}>
          <NavBarStageContainer>
            <NavigationBar
              styleName="clear"
              title="TITLE"
              style={{ backgroundColor: 'red' }}
            />
          </NavBarStageContainer>
        </View>
      </Stage>
      <Stage title="Navbar / Clear (Image)">
        <ImageBackground
          source={{ uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-3.png' }}
          style={{
            width: window.width,
            height: Device.select({
              iPhoneX: NAVIGATION_HEADER_HEIGHT + IPHONE_X_NOTCH_PADDING,
              iPhoneXR: NAVIGATION_HEADER_HEIGHT + IPHONE_XR_NOTCH_PADDING,
              default: NAVIGATION_HEADER_HEIGHT,
            }),
          }}
        >
          <NavigationBar
            styleName="clear"
            title="TITLE"
          />
        </ImageBackground>
      </Stage>
      <Heading styleName="sm-gutter">Navigation bar variations</Heading>
      <Stage title="Navbar + Drawer">
        <NavBarStageContainer>
          <NavigationBar
            leftComponent={(
              <Button>
                <Icon name="close" />
              </Button>
            )}
            title="TITLE"
          />
        </NavBarStageContainer>
      </Stage>
      <Stage title="Navbar + Picker">
        <NavBarStageContainer>
          <NavigationBar
            leftComponent={(
              <Button>
                <Icon name="sidebar" />
              </Button>
            )}
            title="TITLE"
            rightComponent={(
              <DropDownMenu
                options={navBarDropDownOptions}
                selectedOption={navBarDropDownSelectedOption}
                titleProperty="name"
                valueProperty="value"
              />
            )}
          />
        </NavBarStageContainer>
      </Stage>
      <Stage title="Navbar + Action">
        <NavBarStageContainer>
          <NavigationBar
            leftComponent={(
              <Button>
                <Icon name="sidebar" />
              </Button>
            )}
            title="TITLE"
            rightComponent={(
              <Button styleName="clear">
                <Text>List</Text>
              </Button>
            )}
          />
        </NavBarStageContainer>
      </Stage>
      <Stage title="Navbar + Icon">
        <NavBarStageContainer>
          <NavigationBar
            leftComponent={(
              <Button>
                <Icon name="sidebar" />
              </Button>
            )}
            title="TITLE"
            rightComponent={(
              <Button>
                <Icon name="cart" />
              </Button>
            )}
          />
        </NavBarStageContainer>
      </Stage>
      <Stage title="Navbar (Sublevel) + Icon">
        <NavBarStageContainer>
          <NavigationBar
            leftComponent={(
              <Button>
                <Icon name="back" />
              </Button>
            )}
            title="TITLE"
            share={{
              link: 'http://shoutem.github.io',
              text: 'This is the best',
              title: 'Super cool UI Toolkit',
            }}
          />
        </NavBarStageContainer>
      </Stage>
      <Stage title="Navbar (Sublevel) + Action (no border)">
        <NavBarStageContainer>
          <NavigationBar
            styleName="no-border"
            leftComponent={(
              <Button>
                <Icon name="back" />
              </Button>
            )}
            title="TITLE"
            share={{
              link: 'http://shoutem.github.io',
              text: 'This is the best',
              title: 'Super cool UI Toolkit',
            }}
          />
        </NavBarStageContainer>
      </Stage>
      <Stage title="Navbar (Sublevel) + Action">
        <NavBarStageContainer>
          <NavigationBar
            leftComponent={(
              <Button>
                <Icon name="back" />
              </Button>
            )}
            title="TITLE"
            rightComponent={(
              <Button styleName="clear">
                <Text>Report</Text>
              </Button>
            )}
          />
        </NavBarStageContainer>
      </Stage>
      <Stage title="Navbar (Modal) + Icon">
        <NavBarStageContainer>
          <NavigationBar
            leftComponent={(
              <Button>
                <Icon name="close" />
              </Button>
            )}
            title="TITLE"
            share={{
              link: 'http://shoutem.github.io',
              text: 'This is the best',
              title: 'Super cool UI Toolkit',
            }}
          />
        </NavBarStageContainer>
      </Stage>
      <Stage title="Navbar (Modal) + Action">
        <NavBarStageContainer>
          <NavigationBar
            leftComponent={(
              <Button>
                <Icon name="close" />
              </Button>
            )}
            title="TITLE"
            rightComponent={(
              <Button styleName="clear">
                <Text>Post</Text>
              </Button>
            )}
          />
        </NavBarStageContainer>
      </Stage>
      <Stage title="Navbar (Modal) + Action 2">
        <NavBarStageContainer>
          <NavigationBar
            leftComponent={(
              <Button>
                <Text>Cancel</Text>
              </Button>
            )}
            title="TITLE"
            rightComponent={(
              <Button>
                <Text>Done</Text>
              </Button>
            )}
          />
        </NavBarStageContainer>
      </Stage>
      <Stage title="Navbar (Modal) + Action 2 (disabled)">
        <NavBarStageContainer>
          <NavigationBar
            leftComponent={(
              <Button>
                <Text>Cancel</Text>
              </Button>
            )}
            title="TITLE"
            rightComponent={(
              <Button styleName="muted">
                <Text>Done</Text>
              </Button>
            )}
          />
        </NavBarStageContainer>
      </Stage>
      <Stage title="Navbar / On primary color / back + share">
        <NavBarStageContainer style={{ backgroundColor: '#1a70d5' }}>
          <NavigationBar
            styleName="clear"
            leftComponent={(
              <Button>
                <Icon name="back" />
              </Button>
            )}
            title="TITLE"
            share={{
              link: 'http://shoutem.github.io',
              text: 'This is the best',
              title: 'Super cool UI Toolkit',
            }}
          />
        </NavBarStageContainer>
      </Stage>
    </View>
  );
}
