import React from 'react';

import { Stage } from './Stage';
import {
  View,
  Button,
  Icon,
  Text,
} from '../../index';

export function Buttons() {
  return (
    <View styleName="vertical collapsed">
      <Stage title="Button / Text only / Light">
        <Button>
          <Text>CHECK IN HERE</Text>
        </Button>
      </Stage>

      <Stage title="Button / Text only / Dark">
        <Button styleName="dark">
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
        <Button styleName="dark">
          <Icon name="add-event" />
          <Text>ADD TO CALENDAR</Text>
        </Button>
      </Stage>

      <Stage title="Button / Fixed size">
        <View styleName="horizontal flexible">
          <Button styleName="confirmation">
            <Text>REMOVE</Text>
          </Button>

          <Button styleName="confirmation dark">
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
        <Button styleName="tight clear">
          <Icon name="add-to-favorites-full" />
        </Button>
      </Stage>

      <Stage title="Button / Vertical / Icon + Text">
        <Button styleName="stacked clear">
          <Icon name="tweet" />
          <Text>Text description</Text>
        </Button>
      </Stage>

      <Stage title="Button / Full width - Normal">
        <View styleName="horizontal flexible">
          <Button styleName="full-width muted">
            <Icon name="add-to-favorites-full" />
            <Text>LIKE</Text>
          </Button>
          <Button styleName="full-width muted">
            <Icon name="comment-full" />
            <Text>COMMENT</Text>
          </Button>
        </View>
      </Stage>

      <Stage title="Button / Full width - Active (Feed)">
        <View styleName="horizontal flexible">
          <Button styleName="full-width">
            <Icon name="add-to-favorites-full" />
            <Text>LIKE</Text>
          </Button>
          <Button styleName="full-width">
            <Icon name="comment-full" />
            <Text>COMMENT</Text>
          </Button>
        </View>
      </Stage>
    </View>
  );
}
