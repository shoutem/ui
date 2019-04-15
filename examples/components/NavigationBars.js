import React from 'react';
import { Dimensions } from 'react-native';

import { Text, Title, Heading } from '../../components/Text';
import { View } from '../../components/View';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { DropDownMenu } from '../../components/DropDownMenu';
import { NavigationBar } from '../../components/NavigationBar';
import { ImageBackground } from '../../components/ImageBackground';
import { Stage } from './Stage';

const window = Dimensions.get('window');

function NavBarStageContainer(props) {
  return (
    <View
      {...props}
      style={{
        width: window.width,
        height: 70,
        ...props.style,
      }}
    />
  );
}

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

export function NavigationBars() {
  return (
    <View styleName="vertical collapsed">
      <Stage title="Navbar / Solid">
        <NavBarStageContainer>
          <NavigationBar
            centerComponent={<Title>TITLE</Title>}
          />
        </NavBarStageContainer>
      </Stage>
      <Stage title="Navbar / Clear (Solid color)">
        <NavBarStageContainer style={{ backgroundColor: '#1a70d5', }}>
          <NavigationBar
            styleName="clear"
            centerComponent={<Title>TITLE</Title>}
          />
        </NavBarStageContainer>
      </Stage>
      <Stage title="Navbar / Clear (Image)">
        <ImageBackground
          source={{ uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-3.png' }}
          style={{
            width: window.width,
            height: 70,
          }}
        >
          <NavigationBar
            styleName="clear"
            centerComponent={<Title>TITLE</Title>}
          />
        </ImageBackground>
      </Stage>
      <Stage title="Navbar/ Fade (Gradient overlay + Solid color)">
        <NavBarStageContainer style={{ backgroundColor: '#1a70d5', }}>
          <NavigationBar
            styleName="fade clear"
            centerComponent={<Title>TITLE</Title>}
          />
        </NavBarStageContainer>
      </Stage>
      <Stage title="Navbar / Fade (Gradient overlay + Image)">
        <ImageBackground
          source={{uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-3.png' }}
          style={{
            width: window.width,
            height: 70,
          }}
        >
          <NavigationBar
            styleName="fade clear"
            centerComponent={<Title>TITLE</Title>}
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
            centerComponent={<Title>TITLE</Title>}
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
            centerComponent={<Title>TITLE</Title>}
            rightComponent={<DropDownMenu
              options={navBarDropDownOptions}
              selectedOption={navBarDropDownSelectedOption}
              titleProperty="name"
              valueProperty="value"
            />}
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
            centerComponent={<Title>TITLE</Title>}
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
            centerComponent={<Title>TITLE</Title>}
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
        <NavBarStageContainer style={{ backgroundColor: '#1a70d5', }}>
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
