import React, { useEffect, useState } from 'react';
import { ActionSheet, AnimatedScrollingText, Button, Caption, Card, CategoryPicker, DateTimePicker, Divider, DropDownMenu, EmptyListImage, EmptyStateView, FormGroup, GridRow, Heading, HorizontalPager, Html, Icon, Image, ImageBackground, ImageCarousel, ImageGallery, ImageGalleryOverlay, ImagePreview, InlineDropDownMenu, InlineGallery, Lightbox, LinearGradient, ListView, LoadingContainer, LoadingIndicator, NumberInput, Overlay, PageIndicators, ProgressRings, Row, Screen, ScrollView, SearchField, ShareButton, SimpleHtml, Spinner, Subtitle, Switch, TabMenu, Text, TextInput, Tile, Title, Toast, Touchable, TouchableNativeFeedback, TouchableOpacity, Video, View, YearRangePicker } from '@shoutem/ui';
import { avatar, photos } from './images';
import _ from 'lodash';

// User overrides: x.style merges over a demo's own style; other keys spread last so they win.
const ms = (base, over) => (over ? _.merge({}, base, over) : base);
const xs = x => _.omit(x, 'style');
export const ICON_NAMES = 'about activity add-event add-friend add-to-cart add-to-favorites-off add-to-favorites-on address attach-media back books call cam-switch camera cart checkbox-off checkbox-on checkbox-rectangle-off checkbox-rectangle-on checkmark-oval checkmark-round clear-text clock close comment comments deals delete directions down-arrow download drop-down edit email equalizer error-rectangle error events exit-to-app eye-crossed eye facebook-logo facebook filters folder forward-10 forward-30 forward-5 forward friends full-screen gallery garbage-can gift github hang-up history home instagram laptop left-arrow like-heart like link linkedin location-pins lock loyalty-card maps mic-off mic minus-button missing more-horizontal music-note music-video my-location news notifications page pause photo pin play playlist-play plus-button podcasts products queue radio radiobutton-off radiobutton-on receipt refresh repeat replay-10 replay-30 replay-5 replay restaurant-menu restaurant restore right-arrow rss-feed rsvp search settings share-android share sidebar skip-next sleep social-wall speed-meter stamp stop take-a-photo tiktok trophy turn-off tweet uber unfriend up-arrow user-profile users video-cam-off video-cam video-chat video-recording web wheelchair'.split(' ');

// Control helpers
const text = (key, def, label) => ({
  key,
  type: 'text',
  default: def,
  label
});
const area = (key, def, label) => ({
  key,
  type: 'textarea',
  default: def,
  label
});
const num = (key, def, opts = {}) => ({
  key,
  type: 'number',
  default: def,
  ...opts
});
const bool = (key, def, label) => ({
  key,
  type: 'bool',
  default: def,
  label
});
const select = (key, def, options, label) => ({
  key,
  type: 'select',
  default: def,
  options,
  label
});
const color = (key, def, label) => ({
  key,
  type: 'color',
  default: def,
  label
});
const icon = (key, def, label) => ({
  key,
  type: 'select',
  default: def,
  options: ICON_NAMES,
  label
});
const json = (key, def, label) => ({
  key,
  type: 'json',
  default: def,
  label
});
const sentence = 'Seasonal menu, live jazz on Fridays and a terrace that faces the old harbor.';
const people = [{
  id: 1,
  name: 'Ana Horvat',
  role: 'Head chef',
  image: photos[0].source
}, {
  id: 2,
  name: 'Marko Kovač',
  role: 'Sommelier',
  image: photos[1].source
}, {
  id: 3,
  name: 'Ivana Perić',
  role: 'Pastry',
  image: photos[2].source
}, {
  id: 4,
  name: 'Luka Babić',
  role: 'Front of house',
  image: photos[3].source
}, {
  id: 5,
  name: 'Petra Jurić',
  role: 'Bar manager',
  image: photos[4].source
}, {
  id: 6,
  name: 'Tomo Marić',
  role: 'Line cook',
  image: photos[5].source
}];
const menuOptions = [{
  title: 'All dishes',
  value: 'all'
}, {
  title: 'Starters',
  value: 'starters'
}, {
  title: 'Mains',
  value: 'mains'
}, {
  title: 'Desserts',
  value: 'desserts'
}, {
  title: 'Wine list',
  value: 'wine'
}];
function Pressed({
  count
}) {
  return <Caption styleName="h-center md-gutter-top">Pressed {count}×</Caption>;
}

// Each entry: name, group, target (theme key for styleName discovery), controls,
// defaultStyleName, Demo({ p, sn }), code(p, sn), note.
export const registry = [
// ───────────── Liquid glass
{
  name: 'Glass showcase',
  group: 'Liquid glass',
  target: null,
  styleNameDisabled: true,
  note: 'A typical screen. Nothing in this JSX mentions glass: the controls get it from the theme when the Liquid glass option is on. Scroll the feed to see it pass under the search field, tabs and buttons.',
  controls: [text('search', 'Search places'), text('primary', 'SHARE'), text('secondary', 'RESERVE')],
  Demo: ({ p, vars }) => {
    const [sel, setSel] = useState(menuOptions[0]);
    const [sheet, setSheet] = useState(false);
    const close = () => setSheet(false);
    const prices = ['€€', '€€€', '€', '€€', '€€€', '€'];
    return <View style={{ height: 670, position: 'relative', backgroundColor: vars.backgroundColor }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 118, paddingBottom: 96 }}>
          {photos.map((ph, i) => <View key={ph.title} style={{ marginHorizontal: 12, marginBottom: 12, borderRadius: 20, overflow: 'hidden' }}>
              <ImageBackground source={ph.source} style={{ width: '100%', height: 230 }}>
                <Overlay style={{ position: 'absolute', top: 12, left: 12 }}><Caption>{prices[i]} · {(4.1 + (i % 4) / 5).toFixed(1)} ★</Caption></Overlay>
                <View style={{ position: 'absolute', left: 16, bottom: 14, right: 16 }}>
                  <Title style={{ color: '#fff' }}>{ph.title}</Title>
                  <Caption style={{ color: 'rgba(255,255,255,0.85)' }}>{2 + i} km away · open until 23:00</Caption>
                </View>
              </ImageBackground>
            </View>)}
        </ScrollView>
        <View style={{ position: 'absolute', top: 4, left: 0, right: 0 }}>
          <View style={{ paddingHorizontal: 12, paddingTop: 4 }}><SearchField placeholder={p.search} onChangeText={() => {}} /></View>
          <TabMenu options={menuOptions} selectedOption={sel} onOptionSelected={setSel} />
        </View>
        <View style={{ position: 'absolute', left: 12, right: 12, bottom: 18, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button onPress={() => setSheet(true)}><Icon name="share" /><Text>{p.primary}</Text></Button>
          <Button styleName="secondary" onPress={() => Toast.showSuccess({ title: 'Table booked', message: 'Friday 14 Nov, 19:30 · 4 guests' })}><Icon name="add-event" /><Text>{p.secondary}</Text></Button>
        </View>
        <ActionSheet active={sheet} confirmOptions={[{ title: 'Share link', onPress: close }, { title: 'Add to favorites', onPress: close }]} cancelOptions={[{ title: 'Cancel', onPress: close }]} onDismiss={close} />
      </View>;
  },
  code: p => `// No glass-specific code. Same JSX with the option on or off.\n<Screen>\n  <ListView data={places} renderRow={renderPlace} />\n\n  <SearchField placeholder="${p.search}" onChangeText={setQuery} />\n  <TabMenu options={tabs} selectedOption={tab} onOptionSelected={setTab} />\n\n  <Button onPress={openShareSheet}>\n    <Icon name="share" />\n    <Text>${p.primary}</Text>\n  </Button>\n  <Button styleName="secondary" onPress={reserve}>\n    <Icon name="add-event" />\n    <Text>${p.secondary}</Text>\n  </Button>\n</Screen>\n\n// Place card price tag\n<Overlay><Caption>€€ · 4.3 ★</Caption></Overlay>`
},
// ───────────── Typography
{
  name: 'Text',
  group: 'Typography',
  target: p => `shoutem.ui.${p.variant}`,
  controls: [select('variant', 'Title', ['Heading', 'Title', 'Subtitle', 'Text', 'Caption']), area('children', 'Konoba Batelina, Banjole'), num('numberOfLines', 0, {
    min: 0,
    max: 6
  })],
  Demo: ({
    p,
    sn,
    x = {}
  }) => {
    const C = {
      Heading,
      Title,
      Subtitle,
      Text,
      Caption
    }[p.variant];
    return <View styleName="md-gutter"><C styleName={sn} numberOfLines={p.numberOfLines || undefined} {...x}>{p.children}</C></View>;
  },
  code: (p, sn) => `<${p.variant}${attr('styleName', sn)}${p.numberOfLines ? ` numberOfLines={${p.numberOfLines}}` : ''}>\n  ${p.children}\n</${p.variant}>`
}, {
  name: 'Type scale',
  group: 'Typography',
  target: 'shoutem.ui.Text',
  styleNameTarget: 'all text',
  controls: [text('sample', 'The quick brown fox jumps')],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <View styleName="md-gutter">
        {[Heading, Title, Subtitle, Text, Caption].map((C, i) => <View key={i} styleName="sm-gutter-bottom">
            <Caption styleName="muted">{['Heading', 'Title', 'Subtitle', 'Text', 'Caption'][i]}</Caption>
            <C styleName={sn} {...x}>{p.sample}</C>
          </View>)}
      </View>,
  code: (p, sn) => ['Heading', 'Title', 'Subtitle', 'Text', 'Caption'].map(n => `<${n}${attr('styleName', sn)}>${p.sample}</${n}>`).join('\n')
}, {
  name: 'AnimatedScrollingText',
  group: 'Typography',
  target: 'shoutem.ui.AnimatedScrollingText',
  controls: [text('text', 'Now playing: Arsen Dedić — Pjevam danju, pjevam noću (live at Lisinski, 1983)')],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <View styleName="md-gutter"><AnimatedScrollingText styleName={sn} text={p.text} {...x} /></View>,
  code: (p, sn) => `<AnimatedScrollingText${attr('styleName', sn)} text="${p.text}" />`
},
// ───────────── Layout
{
  name: 'View',
  group: 'Layout',
  target: 'shoutem.ui.View',
  defaultStyleName: 'horizontal space-between md-gutter',
  controls: [num('boxes', 3, {
    min: 1,
    max: 6
  }), color('boxColor', '#659CEC')],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <View styleName={sn} style={ms({
    backgroundColor: 'rgba(101,156,236,0.08)',
    minHeight: 160
  }, x.style)} {...xs(x)}>
        {Array.from({
      length: p.boxes
    }).map((_, i) => <View key={i} style={{
      width: 56,
      height: 56,
      borderRadius: 6,
      backgroundColor: p.boxColor,
      opacity: 1 - i * 0.12
    }} />)}
      </View>,
  code: (p, sn) => `<View${attr('styleName', sn)}>\n  {/* ${p.boxes} children */}\n</View>`
}, {
  name: 'Screen',
  group: 'Layout',
  target: 'shoutem.ui.Screen',
  controls: [text('title', 'Reservations')],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <Screen styleName={sn} style={ms({
    minHeight: 300
  }, x.style)} {...xs(x)}>
        <View styleName="md-gutter"><Title>{p.title}</Title><Caption>Screen is the root container of every app screen.</Caption></View>
      </Screen>,
  code: (p, sn) => `<Screen${attr('styleName', sn)}>\n  <Title>${p.title}</Title>\n</Screen>`
}, {
  name: 'ScrollView',
  group: 'Layout',
  target: 'shoutem.ui.ScrollView',
  controls: [num('rows', 12, {
    min: 1,
    max: 40
  }), bool('horizontal', false)],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <ScrollView styleName={sn} horizontal={p.horizontal} style={ms({
    height: 320
  }, x.style)} {...xs(x)}>
        {Array.from({
      length: p.rows
    }).map((_, i) => <View key={i} styleName="md-gutter" style={{
      borderBottomWidth: 1,
      borderColor: 'rgba(0,0,0,0.06)',
      minWidth: p.horizontal ? 140 : undefined
    }}>
            <Subtitle>Table {i + 1}</Subtitle><Caption>{2 + i % 5} guests · 19:{i * 15 % 60 || '00'}</Caption>
          </View>)}
      </ScrollView>,
  code: (p, sn) => `<ScrollView${attr('styleName', sn)}${p.horizontal ? ' horizontal' : ''}>\n  {rows}\n</ScrollView>`
}, {
  name: 'Row',
  group: 'Layout',
  target: 'shoutem.ui.Row',
  controls: [text('title', 'Konoba Batelina'), text('caption', 'Banjole · 4.8 ★ · 1.2 km'), bool('showImage', true), bool('showArrow', true), icon('arrow', 'right-arrow')],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <Row styleName={sn} {...x}>
        {p.showImage && <Image styleName="small rounded-corners" source={photos[0].source} />}
        <View styleName="vertical stretch space-between">
          <Subtitle>{p.title}</Subtitle>
          <Caption>{p.caption}</Caption>
        </View>
        {p.showArrow && <Icon styleName="disclosure" name={p.arrow} />}
      </Row>,
  code: (p, sn) => `<Row${attr('styleName', sn)}>\n${p.showImage ? '  <Image styleName="small rounded-corners" source={...} />\n' : ''}  <View styleName="vertical stretch space-between">\n    <Subtitle>${p.title}</Subtitle>\n    <Caption>${p.caption}</Caption>\n  </View>\n${p.showArrow ? `  <Icon styleName="disclosure" name="${p.arrow}" />\n` : ''}</Row>`
}, {
  name: 'Card',
  group: 'Layout',
  target: 'shoutem.ui.Card',
  controls: [text('title', 'Truffle tagliatelle'), text('caption', '€18 · Istrian black truffle'), select('image', 0, [0, 1, 2, 3, 4, 5])],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <View styleName="md-gutter horizontal">
        <Card styleName={sn} {...x}>
          <Image styleName="medium-wide" source={photos[+p.image].source} />
          <View styleName="content">
            <Subtitle>{p.title}</Subtitle>
            <Caption>{p.caption}</Caption>
          </View>
        </Card>
      </View>,
  code: (p, sn) => `<Card${attr('styleName', sn)}>\n  <Image styleName="medium-wide" source={...} />\n  <View styleName="content">\n    <Subtitle>${p.title}</Subtitle>\n    <Caption>${p.caption}</Caption>\n  </View>\n</Card>`
}, {
  name: 'Tile',
  group: 'Layout',
  target: 'shoutem.ui.Tile',
  controls: [text('title', 'Summer terrace opens 1 June'), text('subtitle', 'Book a sunset table'), bool('overImage', true), bool('withButton', true), text('buttonText', 'BOOK NOW')],
  Demo: ({
    p,
    sn,
    x = {}
  }) => {
    const tile = <Tile styleName={sn} {...x}>
          <Title styleName={p.overImage ? 'md-gutter-bottom' : ''}>{p.title}</Title>
          <Subtitle styleName="sm-gutter-horizontal">{p.subtitle}</Subtitle>
          {p.withButton && <Button styleName="md-gutter-top"><Text>{p.buttonText}</Text></Button>}
        </Tile>;
    return p.overImage ? <ImageBackground styleName="large-banner" source={photos[0].source}>{tile}</ImageBackground> : tile;
  },
  code: (p, sn) => `${p.overImage ? '<ImageBackground styleName="large-banner" source={...}>\n' : ''}<Tile${attr('styleName', sn)}>\n  <Title>${p.title}</Title>\n  <Subtitle>${p.subtitle}</Subtitle>\n${p.withButton ? `  <Button><Text>${p.buttonText}</Text></Button>\n` : ''}</Tile>${p.overImage ? '\n</ImageBackground>' : ''}`
}, {
  name: 'GridRow',
  group: 'Layout',
  target: 'shoutem.ui.GridRow',
  controls: [num('columns', 2, {
    min: 1,
    max: 4
  })],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <View>
        {[0, 1].map(r => <GridRow key={r} columns={p.columns} styleName={sn} {...x}>
            {people.slice(r * p.columns, r * p.columns + p.columns).map(person => <Card key={person.id} styleName="flexible">
                <Image styleName="medium-wide" source={person.image} />
                <View styleName="content"><Subtitle numberOfLines={1}>{person.name}</Subtitle><Caption>{person.role}</Caption></View>
              </Card>)}
          </GridRow>)}
      </View>,
  code: (p, sn) => `<GridRow columns={${p.columns}}${attr('styleName', sn)}>\n  <Card styleName="flexible">…</Card>\n  …\n</GridRow>`
}, {
  name: 'Divider',
  group: 'Layout',
  target: 'shoutem.ui.Divider',
  defaultStyleName: 'section-header',
  controls: [text('label', 'OPENING HOURS'), bool('withLabel', true)],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <View>
        <View styleName="md-gutter"><Text>Above the divider</Text></View>
        <Divider styleName={sn} {...x}>{p.withLabel && <Caption>{p.label}</Caption>}</Divider>
        <View styleName="md-gutter"><Text>Below the divider</Text></View>
      </View>,
  code: (p, sn) => p.withLabel ? `<Divider${attr('styleName', sn)}>\n  <Caption>${p.label}</Caption>\n</Divider>` : `<Divider${attr('styleName', sn)} />`
}, {
  name: 'Overlay',
  group: 'Layout',
  target: 'shoutem.ui.Overlay',
  defaultStyleName: 'image-overlay',
  controls: [text('heading', 'Fish of the day'), text('caption', 'Grilled sea bass, chard & potatoes')],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <ImageBackground styleName="large-banner" source={photos[1].source}>
        <Overlay styleName={sn} {...x}>
          <Heading>{p.heading}</Heading>
          <Caption>{p.caption}</Caption>
        </Overlay>
      </ImageBackground>,
  code: (p, sn) => `<Overlay${attr('styleName', sn)}>\n  <Heading>${p.heading}</Heading>\n  <Caption>${p.caption}</Caption>\n</Overlay>`
}, {
  name: 'LinearGradient',
  group: 'Layout',
  target: 'shoutem.ui.LinearGradient',
  controls: [color('from', '#659CEC'), color('to', '#2c2c2c'), num('height', 180, {
    min: 40,
    max: 400
  }), num('startY', 0, {
    min: 0,
    max: 1,
    step: 0.1
  }), num('endY', 1, {
    min: 0,
    max: 1,
    step: 0.1
  })],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <LinearGradient styleName={sn} colors={[p.from, p.to]} start={{
    x: 0.5,
    y: p.startY
  }} end={{
    x: 0.5,
    y: p.endY
  }} style={ms({
    height: p.height,
    alignItems: 'center',
    justifyContent: 'center'
  }, x.style)} {...xs(x)}>
        <Title style={{
      color: '#fff'
    }}>Gradient</Title>
      </LinearGradient>,
  code: (p, sn) => `<LinearGradient${attr('styleName', sn)}\n  colors={['${p.from}', '${p.to}']}\n  start={{ x: 0.5, y: ${p.startY} }}\n  end={{ x: 0.5, y: ${p.endY} }}\n  style={{ height: ${p.height} }}\n/>`
},
// ───────────── Buttons & touchables
{
  name: 'Button',
  group: 'Buttons & inputs',
  target: 'shoutem.ui.Button',
  controls: [text('label', 'RESERVE A TABLE'), bool('withIcon', true), icon('iconName', 'add-event'), bool('withText', true), bool('disabled', false)],
  Demo: ({
    p,
    sn,
    x = {}
  }) => {
    const [n, setN] = useState(0);
    return <View styleName="md-gutter">
          <Button styleName={sn} disabled={p.disabled} onPress={() => setN(n + 1)} {...x}>
            {p.withIcon && <Icon name={p.iconName} />}
            {p.withText && <Text>{p.label}</Text>}
          </Button>
          <Pressed count={n} />
        </View>;
  },
  code: (p, sn) => `<Button${attr('styleName', sn)}${p.disabled ? ' disabled' : ''} onPress={...}>\n${p.withIcon ? `  <Icon name="${p.iconName}" />\n` : ''}${p.withText ? `  <Text>${p.label}</Text>\n` : ''}</Button>`
}, {
  name: 'Touchable',
  group: 'Buttons & inputs',
  target: 'shoutem.ui.Touchable',
  controls: [select('kind', 'Touchable', ['Touchable', 'TouchableOpacity', 'TouchableNativeFeedback']), text('label', 'Tap this row')],
  Demo: ({
    p,
    sn,
    x = {}
  }) => {
    const [n, setN] = useState(0);
    const C = {
      Touchable,
      TouchableOpacity,
      TouchableNativeFeedback
    }[p.kind];
    return <View>
          <C styleName={sn} onPress={() => setN(n + 1)} {...x}>
            <Row><Icon name="restaurant" /><Text>{p.label}</Text><Icon styleName="disclosure" name="right-arrow" /></Row>
          </C>
          <Pressed count={n} />
        </View>;
  },
  code: (p, sn) => `<${p.kind}${attr('styleName', sn)} onPress={...}>\n  <Row>…</Row>\n</${p.kind}>`
}, {
  name: 'ShareButton',
  group: 'Buttons & inputs',
  target: 'shoutem.ui.ShareButton',
  note: 'Uses the native share sheet. Browsers that block Web Share do nothing on press.',
  controls: [text('title', 'Konoba Batelina'), text('message', 'Dinner tonight?'), text('url', 'https://shoutem.com'), select('animationName', '', ['', 'solidify-animation'])],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <View styleName="md-gutter horizontal h-center"><ShareButton styleName={sn} title={p.title} message={p.message} url={p.url} animationName={p.animationName || undefined} {...x} /></View>,
  code: (p, sn) => `<ShareButton${attr('styleName', sn)} title="${p.title}" message="${p.message}" url="${p.url}" />`
}, {
  name: 'TextInput',
  group: 'Buttons & inputs',
  target: 'shoutem.ui.TextInput',
  controls: [text('placeholder', 'Your e-mail'), text('errorMessage', ''), bool('secureTextEntry', false), bool('editable', true), bool('multiline', false)],
  Demo: ({
    p,
    sn,
    x = {}
  }) => {
    const [v, setV] = useState('');
    return <View styleName="md-gutter"><TextInput styleName={sn} placeholder={p.placeholder} value={v} onChangeText={setV} errorMessage={p.errorMessage || undefined} secureTextEntry={p.secureTextEntry} editable={p.editable} multiline={p.multiline} {...x} /></View>;
  },
  code: (p, sn) => `<TextInput${attr('styleName', sn)}\n  placeholder="${p.placeholder}"${p.errorMessage ? `\n  errorMessage="${p.errorMessage}"` : ''}${p.secureTextEntry ? '\n  secureTextEntry' : ''}${!p.editable ? '\n  editable={false}' : ''}${p.multiline ? '\n  multiline' : ''}\n  value={value}\n  onChangeText={setValue}\n/>`
}, {
  name: 'FormGroup',
  group: 'Buttons & inputs',
  target: 'shoutem.ui.FormGroup',
  controls: [text('label', 'NAME'), text('placeholder', 'Ana Horvat'), text('label2', 'PHONE'), text('placeholder2', '+385 91 234 5678')],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <View styleName="md-gutter-vertical">
        <FormGroup styleName={sn} {...x}><Caption>{p.label}</Caption><TextInput placeholder={p.placeholder} /></FormGroup>
        <FormGroup styleName={sn} {...x}><Caption>{p.label2}</Caption><TextInput placeholder={p.placeholder2} /></FormGroup>
      </View>,
  code: (p, sn) => `<FormGroup${attr('styleName', sn)}>\n  <Caption>${p.label}</Caption>\n  <TextInput placeholder="${p.placeholder}" />\n</FormGroup>`
}, {
  name: 'SearchField',
  group: 'Buttons & inputs',
  target: 'shoutem.ui.SearchField',
  controls: [text('placeholder', 'Search the menu'), text('defaultValue', ''), bool('loading', false)],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <View styleName="md-gutter"><SearchField styleName={sn} placeholder={p.placeholder} defaultValue={p.defaultValue} loading={p.loading} onChangeText={() => {}} {...x} /></View>,
  code: (p, sn) => `<SearchField${attr('styleName', sn)}\n  placeholder="${p.placeholder}"${p.loading ? '\n  loading' : ''}\n  onChangeText={setQuery}\n/>`
}, {
  name: 'NumberInput',
  group: 'Buttons & inputs',
  target: 'shoutem.ui.NumberInput',
  controls: [num('min', 1), num('max', 12), num('step', 1, {
    min: 1
  }), num('initial', 2)],
  Demo: ({
    p,
    sn,
    x = {}
  }) => {
    const [v, setV] = useState(p.initial);
    useEffect(() => setV(p.initial), [p.initial]);
    return <View styleName="md-gutter"><Caption styleName="sm-gutter-bottom">Guests</Caption><NumberInput styleName={sn} min={p.min} max={p.max} step={p.step} value={v} onChange={setV} {...x} /></View>;
  },
  code: (p, sn) => `<NumberInput${attr('styleName', sn)}\n  min={${p.min}} max={${p.max}} step={${p.step}}\n  value={guests}\n  onChange={setGuests}\n/>`
}, {
  name: 'Switch',
  group: 'Buttons & inputs',
  target: 'shoutem.ui.Switch',
  controls: [bool('value', true), text('label', 'Push notifications')],
  Demo: ({
    p,
    sn,
    x = {}
  }) => {
    const [v, setV] = useState(p.value);
    useEffect(() => setV(p.value), [p.value]);
    return <Row><Text>{p.label}</Text><Switch styleName={sn} value={v} onValueChange={setV} {...x} /></Row>;
  },
  code: (p, sn) => `<Switch${attr('styleName', sn)} value={${p.value}} onValueChange={setValue} />`
},
// ───────────── Pickers & menus
{
  name: 'DropDownMenu',
  group: 'Pickers & menus',
  target: 'shoutem.ui.DropDownMenu',
  defaultStyleName: 'horizontal',
  controls: [json('options', menuOptions), bool('showSelectedOption', true), icon('iconName', 'drop-down')],
  Demo: ({
    p,
    sn,
    x = {}
  }) => {
    const opts = Array.isArray(p.options) ? p.options : menuOptions;
    const [sel, setSel] = useState(opts[0]);
    return <View styleName="md-gutter" style={{
      minHeight: 120
    }}>
          <DropDownMenu styleName={sn} options={opts} selectedOption={sel || opts[0]} onOptionSelected={setSel} titleProperty="title" valueProperty="value" showSelectedOption={p.showSelectedOption} iconName={p.iconName} {...x} />
        </View>;
  },
  code: (p, sn) => `<DropDownMenu${attr('styleName', sn)}\n  options={options}\n  selectedOption={selected}\n  onOptionSelected={setSelected}\n  titleProperty="title"\n  valueProperty="value"\n/>`
}, {
  name: 'InlineDropDownMenu',
  group: 'Pickers & menus',
  target: 'shoutem.ui.InlineDropDownMenu',
  controls: [text('heading', 'Choose a section'), text('selectedDescriptor', 'Selected'), json('options', menuOptions.map(o => ({
    key: o.value,
    title: o.title
  })))],
  Demo: ({
    p,
    sn,
    x = {}
  }) => {
    const opts = Array.isArray(p.options) ? p.options : [];
    const [sel, setSel] = useState(opts[0]);
    return <View styleName="md-gutter"><InlineDropDownMenu styleName={sn} heading={p.heading} options={opts} selectedOption={sel} selectedDescriptor={p.selectedDescriptor} onOptionSelected={setSel} {...x} /></View>;
  },
  code: (p, sn) => `<InlineDropDownMenu${attr('styleName', sn)}\n  heading="${p.heading}"\n  options={options}\n  selectedOption={selected}\n  onOptionSelected={setSelected}\n/>`
}, {
  name: 'TabMenu',
  group: 'Pickers & menus',
  target: 'shoutem.ui.TabMenu',
  controls: [json('options', menuOptions)],
  Demo: ({
    p,
    sn,
    x = {}
  }) => {
    const opts = Array.isArray(p.options) ? p.options : menuOptions;
    const [sel, setSel] = useState(opts[0]);
    return <View><TabMenu styleName={sn} options={opts} selectedOption={sel} onOptionSelected={setSel} {...x} /><View styleName="md-gutter"><Caption>Selected: {sel && sel.title}</Caption></View></View>;
  },
  code: (p, sn) => `<TabMenu${attr('styleName', sn)}\n  options={options}\n  selectedOption={selected}\n  onOptionSelected={setSelected}\n/>`
}, {
  name: 'CategoryPicker',
  group: 'Pickers & menus',
  target: 'shoutem.ui.CategoryPicker',
  controls: [json('categories', [{
    id: 1,
    name: 'Seafood'
  }, {
    id: 2,
    name: 'Grill'
  }, {
    id: 3,
    name: 'Vegetarian'
  }, {
    id: 4,
    name: 'Pasta'
  }, {
    id: 5,
    name: 'Desserts'
  }, {
    id: 6,
    name: 'Wines'
  }])],
  Demo: ({
    p,
    sn,
    x = {}
  }) => {
    const cats = Array.isArray(p.categories) ? p.categories : [];
    const [sel, setSel] = useState(cats[0]);
    return <CategoryPicker styleName={sn} categories={cats} selectedCategory={sel} onCategorySelected={setSel} {...x} />;
  },
  code: (p, sn) => `<CategoryPicker${attr('styleName', sn)}\n  categories={categories}\n  selectedCategory={selected}\n  onCategorySelected={setSelected}\n/>`
}, {
  name: 'DateTimePicker',
  group: 'Pickers & menus',
  target: 'shoutem.ui.DateTimePicker',
  note: 'The native picker is replaced by the browser date/time input.',
  controls: [select('mode', 'datetime', ['date', 'time', 'datetime']), bool('is24Hour', true), text('confirmButtonText', 'Confirm'), text('cancelButtonText', 'Cancel')],
  Demo: ({
    p,
    sn,
    x = {}
  }) => {
    const [v, setV] = useState(new Date(2026, 10, 14, 19, 30));
    const label = p.mode === 'date' ? v.toLocaleDateString() : p.mode === 'time' ? v.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    }) : v.toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
    return <View styleName="md-gutter"><DateTimePicker styleName={sn} mode={p.mode} is24Hour={p.is24Hour} value={v} textValue={label} onValueChanged={setV} confirmButtonText={p.confirmButtonText} cancelButtonText={p.cancelButtonText} {...x} /></View>;
  },
  code: (p, sn) => `<DateTimePicker${attr('styleName', sn)}\n  mode="${p.mode}"\n  value={date}\n  textValue={formatted}\n  onValueChanged={setDate}\n/>`
}, {
  name: 'YearRangePicker',
  group: 'Pickers & menus',
  target: 'shoutem.ui.YearRangePicker',
  controls: [num('rangeStart', 1990), num('rangeEnd', 2026), text('buttonPlaceholder', 'Vintage'), text('confirmButtonTitle', 'Apply'), text('resetButtonTitle', 'Reset')],
  Demo: ({
    p,
    sn,
    x = {}
  }) => {
    const [years, setYears] = useState([]);
    return <View styleName="md-gutter" style={{
      minHeight: 420
    }}><YearRangePicker styleName={sn} rangeStart={p.rangeStart} rangeEnd={p.rangeEnd} selectedYears={years} onRangeConfirmed={setYears} buttonPlaceholder={p.buttonPlaceholder} confirmButtonTitle={p.confirmButtonTitle} resetButtonTitle={p.resetButtonTitle} {...x} /></View>;
  },
  code: (p, sn) => `<YearRangePicker${attr('styleName', sn)}\n  rangeStart={${p.rangeStart}}\n  rangeEnd={${p.rangeEnd}}\n  selectedYears={years}\n  onRangeConfirmed={setYears}\n/>`
}, {
  name: 'ActionSheet',
  group: 'Pickers & menus',
  target: 'shoutem.ui.ActionSheet',
  controls: [json('confirmOptions', [{
    title: 'Share menu'
  }, {
    title: 'Add to favorites'
  }]), json('cancelOptions', [{
    title: 'Cancel'
  }])],
  Demo: ({
    p,
    sn,
    x = {}
  }) => {
    const [active, setActive] = useState(false);
    const close = () => setActive(false);
    const wrap = o => Array.isArray(o) ? o.map(x => ({
      ...x,
      onPress: close
    })) : [];
    return <View styleName="md-gutter" style={{
      minHeight: 360
    }}>
          <Button onPress={() => setActive(true)}><Text>OPEN ACTION SHEET</Text></Button>
          <ActionSheet styleName={sn} active={active} confirmOptions={wrap(p.confirmOptions)} cancelOptions={wrap(p.cancelOptions)} onDismiss={close} {...x} />
        </View>;
  },
  code: (p, sn) => `<ActionSheet${attr('styleName', sn)}\n  active={active}\n  confirmOptions={[{ title: 'Share menu', onPress }]}\n  cancelOptions={[{ title: 'Cancel', onPress }]}\n  onDismiss={close}\n/>`
},
// ───────────── Media
{
  name: 'Icon',
  group: 'Media',
  target: 'shoutem.ui.Icon',
  controls: [icon('name', 'restaurant'), color('color', '#222222'), num('size', 32, {
    min: 12,
    max: 96
  }), bool('showAll', false, 'Show all icons')],
  Demo: ({
    p,
    sn,
    x = {}
  }) => p.showAll ? <View styleName="horizontal wrap md-gutter" style={{
    flexWrap: 'wrap'
  }}>
        {ICON_NAMES.map(n => <View key={n} styleName="vertical h-center" style={{
      width: 80,
      marginBottom: 14
    }}>
            <Icon name={n} styleName={sn} style={ms({
        color: p.color,
        width: 24,
        height: 24
      }, x.style)} {...xs(x)} />
            <Caption numberOfLines={1} style={{
        fontSize: 9,
        marginTop: 4
      }}>{n}</Caption>
          </View>)}
      </View> : <View styleName="md-gutter horizontal h-center"><Icon name={p.name} styleName={sn} style={ms({
      color: p.color,
      width: p.size,
      height: p.size
    }, x.style)} {...xs(x)} /></View>,
  code: (p, sn) => `<Icon name="${p.name}"${attr('styleName', sn)} style={{ color: '${p.color}', width: ${p.size}, height: ${p.size} }} />`
}, {
  name: 'Image',
  group: 'Media',
  target: 'shoutem.ui.Image',
  defaultStyleName: 'large-banner',
  controls: [select('image', 0, [0, 1, 2, 3, 4, 5]), select('resizeMode', 'cover', ['cover', 'contain', 'stretch', 'center'])],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <View styleName="horizontal h-center"><Image styleName={sn} resizeMode={p.resizeMode} source={photos[+p.image].source} {...x} /></View>,
  code: (p, sn) => `<Image${attr('styleName', sn)}\n  resizeMode="${p.resizeMode}"\n  source={{ uri: 'https://…' }}\n/>`
}, {
  name: 'ImageBackground',
  group: 'Media',
  target: 'shoutem.ui.ImageBackground',
  defaultStyleName: 'large-banner',
  controls: [select('image', 3, [0, 1, 2, 3, 4, 5]), text('title', 'Live music on the terrace'), text('caption', 'Every Friday from 21:00')],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <ImageBackground styleName={sn} source={photos[+p.image].source} {...x}>
        <Tile><Title styleName="md-gutter-bottom">{p.title}</Title><Caption>{p.caption}</Caption></Tile>
      </ImageBackground>,
  code: (p, sn) => `<ImageBackground${attr('styleName', sn)} source={...}>\n  <Tile>\n    <Title>${p.title}</Title>\n    <Caption>${p.caption}</Caption>\n  </Tile>\n</ImageBackground>`
}, {
  name: 'ImageCarousel',
  group: 'Media',
  target: 'shoutem.ui.ImageCarousel',
  controls: [bool('showArrows', true), bool('showPageIndicators', true), bool('autoplay', false), num('autoplayIntervalMs', 3000, {
    min: 1000,
    step: 500
  }), num('cardAspectRatio', 1.78, {
    min: 0.5,
    max: 3,
    step: 0.1
  }), num('maxPageIndicators', 10, {
    min: 1
  }), bool('scrollEnabled', true)],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <View styleName="md-gutter-vertical">
        <ImageCarousel styleName={sn} data={photos.map((x, i) => ({
      id: String(i),
      ...x
    }))} showArrows={p.showArrows} showPageIndicators={p.showPageIndicators} autoplay={p.autoplay} autoplayIntervalMs={p.autoplayIntervalMs} cardAspectRatio={p.cardAspectRatio} maxPageIndicators={p.maxPageIndicators} scrollEnabled={p.scrollEnabled} initialWidth={375} {...x} />
      </View>,
  code: (p, sn) => `<ImageCarousel${attr('styleName', sn)}\n  data={images}\n  showArrows={${p.showArrows}}\n  showPageIndicators={${p.showPageIndicators}}\n  autoplay={${p.autoplay}}\n  autoplayIntervalMs={${p.autoplayIntervalMs}}\n  cardAspectRatio={${p.cardAspectRatio}}\n/>`
}, {
  name: 'InlineGallery',
  group: 'Media',
  target: 'shoutem.ui.InlineGallery',
  defaultStyleName: 'large-wide',
  controls: [bool('showNextPage', false), num('selectedIndex', 0, {
    min: 0,
    max: 5
  })],
  Demo: ({
    p,
    sn,
    x = {}
  }) => {
    const [i, setI] = useState(p.selectedIndex);
    useEffect(() => setI(p.selectedIndex), [p.selectedIndex]);
    return <View><InlineGallery styleName={sn} data={photos} showNextPage={p.showNextPage} selectedIndex={i} onIndexSelected={setI} {...x} /><PageIndicators activeIndex={i} count={photos.length} /></View>;
  },
  code: (p, sn) => `<InlineGallery${attr('styleName', sn)}\n  data={images}\n  selectedIndex={index}\n  onIndexSelected={setIndex}${p.showNextPage ? '\n  showNextPage' : ''}\n/>`
}, {
  name: 'ImageGallery',
  group: 'Media',
  target: 'shoutem.ui.ImageGallery',
  controls: [bool('showNextPage', false), bool('withOverlay', true)],
  Demo: ({
    p,
    sn,
    x = {}
  }) => {
    const [i, setI] = useState(0);
    const data = photos.map(x => ({
      ...x,
      description: 'Photographed for the spring menu.'
    }));
    return <View style={{
      height: 460,
      backgroundColor: '#000'
    }}>
          <ImageGallery styleName={sn} data={data} selectedIndex={i} onIndexSelected={setI} showNextPage={p.showNextPage} renderImageOverlay={p.withOverlay ? img => <ImageGalleryOverlay title={img.title} description={img.description} /> : undefined} {...x} />
        </View>;
  },
  code: (p, sn) => `<ImageGallery${attr('styleName', sn)}\n  data={images}\n  selectedIndex={index}\n  onIndexSelected={setIndex}${p.withOverlay ? '\n  renderImageOverlay={img => <ImageGalleryOverlay title={img.title} description={img.description} />}' : ''}\n/>`
}, {
  name: 'ImageGalleryOverlay',
  group: 'Media',
  target: 'shoutem.ui.ImageGalleryOverlay',
  controls: [text('title', 'Harbor dusk'), area('description', 'View from the terrace, 20:41. The fishing boats come in just before sunset.')],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <ImageBackground source={photos[0].source} style={{
    height: 360
  }}>
        <ImageGalleryOverlay styleName={sn} title={p.title} description={p.description} {...x} />
      </ImageBackground>,
  code: (p, sn) => `<ImageGalleryOverlay${attr('styleName', sn)}\n  title="${p.title}"\n  description="${p.description}"\n/>`
}, {
  name: 'ImagePreview',
  group: 'Media',
  target: 'shoutem.ui.ImagePreview',
  note: 'On web, Image ignores width/height props, so this demo also sets style.thumbnail to the same size.',
  controls: [num('width', 345, {
    min: 60,
    max: 375
  }), num('height', 220, {
    min: 60,
    max: 500
  }), select('image', 2, [0, 1, 2, 3, 4, 5])],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <View styleName="md-gutter"><ImagePreview styleName={sn} source={photos[+p.image].source} width={p.width} height={p.height} style={ms({
      thumbnail: {
        width: p.width,
        height: p.height
      }
    }, x.style)} {...xs(x)} /><Caption styleName="h-center sm-gutter-top">Tap the image to open full screen</Caption></View>,
  code: (p, sn) => `<ImagePreview${attr('styleName', sn)} source={...} width={${p.width}} height={${p.height}} />`
}, {
  name: 'Lightbox',
  group: 'Media',
  target: 'shoutem.ui.Lightbox',
  controls: [select('image', 4, [0, 1, 2, 3, 4, 5])],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <View styleName="md-gutter">
        <Lightbox styleName={sn} activeProps={{
      styleName: 'preview'
    }} {...x}>
          <Image styleName="medium-wide" source={photos[+p.image].source} />
        </Lightbox>
        <Caption styleName="sm-gutter-top">Tap the image to open it</Caption>
      </View>,
  code: (p, sn) => `<Lightbox${attr('styleName', sn)} activeProps={{ styleName: 'preview' }}>\n  <Image styleName="medium-wide" source={...} />\n</Lightbox>`
}, {
  name: 'HorizontalPager',
  group: 'Media',
  target: 'shoutem.ui.HorizontalPager',
  controls: [bool('showNextPage', true), num('pageMargin', 20, {
    min: 0,
    max: 60
  }), bool('scrollEnabled', true), bool('bounces', true)],
  Demo: ({
    p,
    sn,
    x = {}
  }) => {
    const [i, setI] = useState(0);
    return <View style={{
      height: 300
    }}>
          <HorizontalPager key={`${p.showNextPage}-${p.pageMargin}`} styleName={sn} data={photos} selectedIndex={i} onIndexSelected={setI} showNextPage={p.showNextPage} pageMargin={p.pageMargin} scrollEnabled={p.scrollEnabled} bounces={p.bounces} renderPage={page => <ImageBackground styleName="fill-parent" source={page.source}><Tile><Title>{page.title}</Title></Tile></ImageBackground>} renderOverlay={() => <PageIndicators activeIndex={i} count={photos.length} />} {...x} />
        </View>;
  },
  code: (p, sn) => `<HorizontalPager${attr('styleName', sn)}\n  data={pages}\n  renderPage={renderPage}\n  pageMargin={${p.pageMargin}}${p.showNextPage ? '\n  showNextPage' : ''}\n  renderOverlay={() => <PageIndicators … />}\n/>`
}, {
  name: 'PageIndicators',
  group: 'Media',
  target: 'shoutem.ui.PageIndicators',
  controls: [num('count', 6, {
    min: 1,
    max: 20
  }), num('activeIndex', 2, {
    min: 0,
    max: 19
  }), num('maxCount', 10, {
    min: 1,
    max: 20
  })],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <View style={{
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.04)'
  }}><PageIndicators styleName={sn} count={p.count} activeIndex={p.activeIndex} maxCount={p.maxCount} {...x} /></View>,
  code: (p, sn) => `<PageIndicators${attr('styleName', sn)} count={${p.count}} activeIndex={${p.activeIndex}} maxCount={${p.maxCount}} />`
}, {
  name: 'Video',
  group: 'Media',
  target: 'shoutem.ui.Video',
  note: 'YouTube and Vimeo embeds cannot load inside the artifact sandbox, so a placeholder shows instead.',
  controls: [text('uri', 'https://www.youtube.com/watch?v=aqz-KE-bpKQ'), num('width', 375), num('height', 211)],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <Video styleName={sn} source={{
    uri: p.uri
  }} width={p.width} height={p.height} {...x} />,
  code: (p, sn) => `<Video${attr('styleName', sn)}\n  source={{ uri: '${p.uri}' }}\n  width={${p.width}}\n  height={${p.height}}\n/>`
},
// ───────────── Lists
{
  name: 'ListView',
  group: 'Lists',
  target: 'shoutem.ui.ListView',
  controls: [num('items', 6, {
    min: 0,
    max: 6
  }), bool('loading', false), bool('withHeader', false), text('emptyListTitle', 'No reservations'), text('emptyListMessage', 'New bookings will appear here.')],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <View style={{
    height: 520
  }}>
        <ListView styleName={sn} data={people.slice(0, p.items)} loading={p.loading} keyExtractor={x => String(x.id)} emptyListTitle={p.emptyListTitle} emptyListMessage={p.emptyListMessage} renderHeader={p.withHeader ? () => <Divider styleName="section-header"><Caption>TONIGHT'S TEAM</Caption></Divider> : undefined} renderRow={item => <Row>
              <Image styleName="small-avatar" source={item.image} />
              <View styleName="vertical"><Subtitle>{item.name}</Subtitle><Caption>{item.role}</Caption></View>
            </Row>} {...x} />
      </View>,
  code: (p, sn) => `<ListView${attr('styleName', sn)}\n  data={staff}\n  loading={${p.loading}}\n  renderRow={item => <Row>…</Row>}\n/>`
}, {
  name: 'EmptyListImage',
  group: 'Lists',
  target: 'shoutem.ui.EmptyListImage',
  controls: [text('title', 'Nothing here yet'), text('message', 'Saved dishes will show up on this screen.')],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <View style={{
    minHeight: 420
  }}><EmptyListImage styleName={sn} title={p.title} message={p.message} {...x} /></View>,
  code: (p, sn) => `<EmptyListImage${attr('styleName', sn)}\n  title="${p.title}"\n  message="${p.message}"\n/>`
}, {
  name: 'EmptyStateView',
  group: 'Lists',
  target: 'shoutem.ui.EmptyStateView',
  controls: [icon('icon', 'error'), text('message', "We couldn't load the menu."), text('retryButtonTitle', 'TRY AGAIN'), bool('withRetry', true)],
  Demo: ({
    p,
    sn,
    x = {}
  }) => {
    const [n, setN] = useState(0);
    return <View style={{
      minHeight: 360
    }}><EmptyStateView styleName={sn} icon={p.icon} message={p.message} retryButtonTitle={p.retryButtonTitle} onRetry={p.withRetry ? () => setN(n + 1) : undefined} {...x} />{n > 0 && <Pressed count={n} />}</View>;
  },
  code: (p, sn) => `<EmptyStateView${attr('styleName', sn)}\n  icon="${p.icon}"\n  message="${p.message}"${p.withRetry ? `\n  retryButtonTitle="${p.retryButtonTitle}"\n  onRetry={reload}` : ''}\n/>`
},
// ───────────── Feedback
{
  name: 'Toast',
  group: 'Feedback',
  target: 'shoutem.ui.InfoToast',
  styleNameDisabled: true,
  controls: [select('kind', 'showInfo', ['showInfo', 'showSuccess', 'showError', 'showAction']), text('title', 'Table booked'), text('message', 'Friday 14 Nov, 19:30 · 4 guests'), text('confirmButtonText', ''), text('cancelButtonText', ''), bool('durationIndicator', true), num('visibilityTime', 4000, {
    min: 1000,
    step: 500
  })],
  Demo: ({
    p,
    x = {}
  }) => <View styleName="md-gutter" style={{
    minHeight: 360
  }}>
        <Button onPress={() => Toast[p.kind]({
      title: p.title,
      message: p.message,
      durationIndicator: p.durationIndicator,
      visibilityTime: p.visibilityTime,
      confirmButtonText: p.confirmButtonText || undefined,
      onConfirm: p.confirmButtonText ? () => Toast.hide() : undefined,
      cancelButtonText: p.cancelButtonText || undefined,
      onCancel: p.cancelButtonText ? () => Toast.hide() : undefined
    })}><Text>SHOW TOAST</Text></Button>
        <Caption styleName="md-gutter-top h-center">Toast colors come from the toast* theme variables.</Caption>
      </View>,
  code: p => `Toast.${p.kind}({\n  title: '${p.title}',\n  message: '${p.message}',${p.confirmButtonText ? `\n  confirmButtonText: '${p.confirmButtonText}',\n  onConfirm,` : ''}${p.cancelButtonText ? `\n  cancelButtonText: '${p.cancelButtonText}',\n  onCancel,` : ''}\n  durationIndicator: ${p.durationIndicator},\n  visibilityTime: ${p.visibilityTime},\n});\n\n// once, near the app root:\n<Toast.Provider />`
}, {
  name: 'Spinner',
  group: 'Feedback',
  target: 'shoutem.ui.Spinner',
  controls: [select('size', 'small', ['small', 'large']), color('color', '')],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <View styleName="md-gutter horizontal h-center"><Spinner styleName={sn} size={p.size} color={p.color || undefined} {...x} /></View>,
  code: (p, sn) => `<Spinner${attr('styleName', sn)} size="${p.size}"${p.color ? ` color="${p.color}"` : ''} />`
}, {
  name: 'LoadingIndicator',
  group: 'Feedback',
  target: 'shoutem.ui.LoadingIndicator',
  controls: [],
  Demo: ({
    sn,
    x = {}
  }) => <View style={{
    height: 200
  }}><LoadingIndicator styleName={sn} {...x} /></View>,
  code: (p, sn) => `<LoadingIndicator${attr('styleName', sn)} />`
}, {
  name: 'LoadingContainer',
  group: 'Feedback',
  target: 'shoutem.ui.LoadingContainer',
  note: 'The Lottie animation is replaced with a browser spinner.',
  controls: [bool('loading', true), num('animationScale', 1, {
    min: 0.2,
    max: 3,
    step: 0.1
  })],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <View styleName="md-gutter horizontal h-center">
        <LoadingContainer styleName={sn} loading={p.loading} animationScale={p.animationScale} {...x}>
          <Button styleName="secondary"><Text>CONFIRM ORDER</Text></Button>
        </LoadingContainer>
      </View>,
  code: (p, sn) => `<LoadingContainer${attr('styleName', sn)} loading={${p.loading}}>\n  <Button><Text>CONFIRM ORDER</Text></Button>\n</LoadingContainer>`
}, {
  name: 'ProgressRings',
  group: 'Feedback',
  target: 'shoutem.ui.ProgressRings',
  controls: [num('size', 200, {
    min: 60,
    max: 340
  }), num('rotation', 0, {
    min: -180,
    max: 180,
    step: 15
  }), num('ring1', 72, {
    min: 0,
    max: 100
  }), color('color1', '#659CEC'), num('ring2', 45, {
    min: 0,
    max: 100
  }), color('color2', '#2c2c2c'), num('lineWidth', 14, {
    min: 2,
    max: 30
  })],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <View styleName="md-gutter horizontal h-center">
        <ProgressRings styleName={sn} size={p.size} rotation={p.rotation} rings={[{
      id: 'a',
      progressPercentage: p.ring1,
      color: p.color1,
      progressLineWidth: p.lineWidth,
      backgroundLineWidth: p.lineWidth
    }, {
      id: 'b',
      progressPercentage: p.ring2,
      color: p.color2,
      progressLineWidth: p.lineWidth,
      backgroundLineWidth: p.lineWidth
    }]} {...x} />
      </View>,
  code: (p, sn) => `<ProgressRings${attr('styleName', sn)}\n  size={${p.size}}\n  rotation={${p.rotation}}\n  rings={[\n    { id: 'a', progressPercentage: ${p.ring1}, color: '${p.color1}' },\n    { id: 'b', progressPercentage: ${p.ring2}, color: '${p.color2}' },\n  ]}\n/>`
},
// ───────────── HTML
{
  name: 'Html',
  group: 'HTML',
  target: 'shoutem.ui.Html',
  controls: [area('body', '<h2>Our story</h2><p>Opened in <strong>1987</strong> by the Batel family, the konoba still serves <em>fish caught that morning</em>.</p><ul><li>Lunch 12–16</li><li>Dinner 18–23</li></ul><p><a href="https://shoutem.com">Visit website</a></p>')],
  Demo: ({
    p,
    sn,
    x = {}
  }) => <View styleName="md-gutter"><Html styleName={sn} body={p.body} {...x} /></View>,
  code: (p, sn) => `<Html${attr('styleName', sn)} body={html} />`
}, {
  name: 'SimpleHtml',
  group: 'HTML',
  target: 'shoutem.ui.SimpleHtml',
  controls: [area('body', '<h3>Allergens</h3><p>Dishes marked <b>(G)</b> contain gluten. Ask your server about <i>dairy-free</i> options.</p>')],
  note: 'SimpleHtml reads style.baseFont, which the default theme does not define. This demo passes one built from the text theme variable.',
  Demo: ({
    p,
    sn,
    vars,
    x = {}
  }) => <SimpleHtml key={p.body + JSON.stringify(vars.text)} styleName={sn} body={p.body} style={ms({
    baseFont: {
      fontFamily: vars.text.fontFamily,
      fontSize: vars.text.fontSize,
      color: vars.text.color
    }
  }, x.style)} {...xs(x)} />,
  code: (p, sn) => `<SimpleHtml${attr('styleName', sn)} body={html} />`
},
// ───────────── Native-only
{
  name: 'ReactNativeHapticFeedback',
  group: 'Native only',
  target: null,
  styleNameDisabled: true,
  note: 'Haptics have no visual output and no browser equivalent. On web this export is a no-op.',
  controls: [select('type', 'impactLight', ['impactLight', 'impactMedium', 'impactHeavy', 'notificationSuccess', 'selection'])],
  Demo: ({
    p,
    x = {}
  }) => <View styleName="md-gutter"><Caption>ReactNativeHapticFeedback.trigger('{p.type}') does nothing in a browser.</Caption></View>,
  code: p => `import { ReactNativeHapticFeedback } from '@shoutem/ui';\n\nReactNativeHapticFeedback.trigger('${p.type}');`
}];
export function attr(name, value) {
  return value ? ` ${name}="${value}"` : '';
}
export { avatar };