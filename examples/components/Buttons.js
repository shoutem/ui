import React from 'react';

import { Icon } from '../../components/Icon';
import { Text } from '../../components/Text';
import { View } from '../../components/View';
import { Button } from '../../components/Button';
import { Stage } from './Stage';

export function Buttons() {
  return (
    <View styleName="vertical collapsed">
      <Stage title="Button / Text only / Light">
        <Button>
          <Text>CHECK IN HERE</Text>
        </Button>
      </Stage>

      <Stage title="Button / Text only / Dark">
        <Button styleName="secondary">
          <Text>CHECK IN HERE</Text>
        </Button>
      </Stage>

      <Stage title="Button / Icon + Text / Light">
        <Button>
          <Icon name="add-event" />
          <Text>ADD TO CALENDAR</Text>
        </Button>
      </Stage>

      <Stage title="Button / Icon + Text / Dark">
        <Button styleName="secondary">
          <Icon name="add-event" />
          <Text>ADD TO CALENDAR</Text>
        </Button>
      </Stage>

      <Stage title="Button / Fixed size">
        <View styleName="horizontal flexible">
          <Button styleName="confirmation">
            <Text>REMOVE</Text>
          </Button>

          <Button styleName="confirmation secondary">
            <Text>UPDATE</Text>
          </Button>
        </View>
      </Stage>

      <Stage title="Button / Full width">
        <Button styleName="full-width">
          <Text>SEE ALL COMMENTS</Text>
        </Button>
      </Stage>

      <Stage title="Button / Navbar">
        <Button styleName="textual">
          <Icon name="add-to-favorites-on" />
        </Button>
      </Stage>

      <Stage title="Button / Vertical / Icon + Text">
        <Button styleName="stacked textual">
          <Icon name="tweet" />
          <Text>Text description</Text>
        </Button>
      </Stage>

      <Stage title="Button / Full width - Normal">
        <View styleName="horizontal flexible">
          <Button styleName="full-width muted">
            <Icon name="add-to-favorites-on" />
            <Text>LIKE</Text>
          </Button>
          <Button styleName="full-width muted">
            <Icon name="comment" />
            <Text>COMMENT</Text>
          </Button>
        </View>
      </Stage>

      <Stage title="Button / Full width - Active (Feed)">
        <View styleName="horizontal flexible">
          <Button styleName="full-width">
            <Icon name="add-to-favorites-on" />
            <Text>LIKE</Text>
          </Button>
          <Button styleName="full-width">
            <Icon name="comment" />
            <Text>COMMENT</Text>
          </Button>
        </View>
      </Stage>
    </View>
  );
}
