import * as R from 'react'
import * as RN from 'react-native'
import { ReactNode, Component } from 'react'


// Helpers
type SimpleObject = { [key: string]: any }
type ViewStyleValue<T = {}> = RN.StyleProp<RN.ViewStyle & T>
type ImageStyleValue<T = {}> = RN.StyleProp<RN.ImageStyle & T>
type TextStyleValue<T = {}> = RN.StyleProp<RN.TextStyle & T>


export = ShoutemUi

export as namespace ShoutemUi

declare namespace ShoutemUi {

    // Basic styleName
    type CommonStyleName =
        | 'sm-gutter' | 'md-gutter' | 'lg-gutter' | 'xl-gutter'
        | 'size-gutter-left' | 'size-gutter-right' | 'size-gutter-top' | 'size-gutter-bottom' | 'size-gutter-horizontal' | 'size-gutter-vertical'
        | 'rounded-corners' | 'flexible' | 'inflexible' | 'collapsible' | 'stretch'

    // Basic class templates
    class SComponent<Props = {}> extends R.Component<(Props & {
        styleName?: string
    })> {}
    class SViewComponent<Props = {}> extends SComponent<Props & RN.ViewProps> {}
    class SImageComponent<Props = {}> extends SComponent<Props & RN.ImageProps> {}
    class STextComponent<Props = {}> extends SComponent<Props & RN.TextProps> {}

    // Text
    type TextStyleName = 'bold' | 'h-center' | 'line-through' | 'multiline' | 'v-center' | 'secondary'
    class Heading extends STextComponent {}
    class Title extends STextComponent {}
    class Subtitle extends STextComponent {}
    class Text extends STextComponent {}
    class Caption extends STextComponent {}

    // NavigationBar
    type NavigationBarStyleName = 'clear' | 'inline' | 'no-border'
    class NavigationBar extends SComponent<{
        title?: string
        centerComponent?: ReactNode
        leftComponent?: ReactNode
        rightComponent?: ReactNode
        hasHistory?: boolean
        navigateBack?: () => void
        style?: {
            centerComponent?: ViewStyleValue
            container?: ViewStyleValue
            componentsContainer?: ViewStyleValue
            leftComponent?: ViewStyleValue
            rightComponent?: ViewStyleValue
        }
    }> {}

    // DropDownMenu
    type DropDownMenuStyleName = 'horizontal'
    class DropDownMenu<T extends {}> extends SComponent<{
        options: T[]
        selectedOption: T
        titleProperty: string
        valueProperty: string
        onOptionSelected?: (option: T) => void
        visibleOptions?: number
        renderOption?: (option: T) => ReactNode
        style?: {
            horizontalContainer?: ViewStyleValue
            selectedOption?: ViewStyleValue
        }
    }> {}

    // ListView
    class ListView<T extends {}> extends SComponent<{
        autoHideHeader?: boolean
        data?: T[]
        loading?: boolean
        onLoadMore?: () => void
        onRefresh?: () => void
        getSectionId?: (item: T) => number | string
        renderRow?: (item: T) => ReactNode
        renderHeader?: () => ReactNode
        renderFooter?: () => ReactNode
        renderSectionHeader?: (sData: any, sId: string | number) => ReactNode
        style?: {
            list?: ViewStyleValue
            listContent?: ViewStyleValue
            headerContainer?: ViewStyleValue
            loadMoreSpinner?: ViewStyleValue
            refreshControl?: ViewStyleValue
        }
    }> {}

    // GridRow
    class GridRow extends SViewComponent<{
        columns: number
    }> {
        static groupByRows: (data: any[], columns: number, getColumnSpan?: (element: any) => number) => any[]
    }

    // Card
    type CardNestedStyleName = 'content'
    class Card extends SViewComponent {}

    // Divider
    type DividerStyleName = 'line small' | 'line center' | 'section-header'
    class Divider extends SViewComponent {}

    // Row
    type RowStyleName = 'small'
    type RowNestedStyleName = 'disclosure' | 'notification-dot' | 'right-icon' | 'top' | 'vertical'
    class Row extends SViewComponent {}

    // Tile
    type TileStyleName = 'clear' | 'small' | 'text-centric'
    type TileNestedStyleName = 'content'
    class Tile extends SViewComponent {}

    // Spinner
    class Spinner extends SComponent<{
        style?: ViewStyleValue<{
            color?: string
            size?: 'small' | 'large'
        }>
    }> {}

    // Button
    type ButtonStyleName = 'action' | 'border' | 'clear' | 'confirmation' | 'secondary' | 'full-width' | 'muted' | 'stacked' | 'tight'
    class Button extends SComponent<RN.TouchableOpacityProps & {
        style?: ViewStyleValue<{
            underlayColor?: string
        }>
    }> {}

    // Switch
    class Switch extends SComponent<{
        value: boolean
        onValueChange: (nextValue: boolean) => void
    }> {}

    // Image
    type ImageStyleName = 'featured' | 'large' | 'large-portrait' | 'large-banner' | 'large-square' | 'large-wide' | 'large-ultra' | 'medium-avatar' | 'medium' | 'medium-wide' | 'medium-square' | 'medium-portrait' | 'rounded-corners' | 'small-avatar' | 'small'
    class Image extends SImageComponent {}

    // ImageBackground
    type ImageBackgroundStyleName = 'featured' | 'large' | 'large-portrait' | 'large-banner' | 'large-square' | 'large-wide' | 'large-ultra' | 'medium' | 'medium-wide' | 'medium-square' | 'medium-portrait' | 'small'
    class ImageBackground extends SComponent<RN.ImageBackgroundProps> {}

    // ImagePreview
    class ImagePreview extends SComponent<{
        source: RN.ImageSourcePropType
        width: number
        height: number
    }> {}

    // InlineGallery
    type InlineGalleryStyleName = 'large-banner' | 'large-square' | 'large-wide' | 'large-ultra-wide'
    class InlineGallery extends SComponent<{
        data: {source: {uri: string}}[]
        onPress?: () => void
        onIndexSelected?: (index: number) => void
        selectedIndex?: number
        style?: {
            imageContainer?: ViewStyleValue
            image?: ImageStyleValue
            container?: ViewStyleValue
        }
        showNextPage?: boolean
        renderOverlay?: () => ReactNode
        renderPlaceholder?: () => ReactNode
    }> {}

    // ImageGallery
    type ImageGalleryItem = {
        source: {
            uri: string
        }
        description: string
        title: string
    }
    class ImageGallery extends SComponent<{
        data: ImageGalleryItem[]
        onIndexSelected?: (index: number) => void
        selectedIndex?: number
        onModeChanged?: (mode: 'gallery' | 'imagePreview') => void
        renderOverlay?: () => ReactNode
        renderImageOverlay?: (item: ImageGalleryItem, index: number) => ReactNode
        renderPlaceholder?: () => ReactNode
        style?: {
            page?: ViewStyleValue
            container?: ViewStyleValue
            pageMargin?: number
        }
    }> {}

    // ImageGalleryOverlay
    class ImageGalleryOverlay extends SComponent<{
        description?: string
        title?: string
        style?: {
            container?: ViewStyleValue
            title: {
                container?: ViewStyleValue
                text?: TextStyleValue
            }
            description: {
                container?: ViewStyleValue
                text?: TextStyleValue
                scroll?: ViewStyleValue
            }
        }
    }> {}

    // Icon
    type IconName = 'sidebar' | 'back' | 'close' | 'left-arrow' | 'right-arrow' | 'up-arrow' | 'down-arrow' | 'drop-down' | 'share' | 'share-android' | 'add-to-favorites-off' | 'add-to-favorites-on' | 'play' | 'pause' | 'edit' | 'refresh' | 'web' | 'email' | 'pin' | 'address' | 'facebook' | 'linkedin' | 'tweet' | 'cart' | 'add-to-cart' | 'add-event' | 'comment' | 'call' | 'activity' | 'friends' | 'add-friend' | 'unfriend' | 'settings' | 'take-a-photo' | 'error' | 'news' | 'like' | 'search' | 'users' | 'user-profile' | 'social-wall' | 'books' | 'folder' | 'events' | 'photo' | 'music-video' | 'radio' | 'podcasts' | 'about' | 'notifications' | 'exit-to-app' | 'restaurant-menu' | 'products' | 'deals' | 'restaurant' | 'more-horizontal' | 'rss-feed' | 'missing' | 'home' | 'checkbox-on' | 'checkbox-off' | 'radiobutton-on' | 'radiobutton-off' | 'minus-button' | 'plus-button' | 'clear-text' | 'receipt' | 'history' | 'gift' | 'loyalty-card' | 'trophy' | 'lock' | 'stamp' | 'turn-off' | 'stop' | 'equalizer' | 'page' | 'rsvp' | 'github' | 'link' | 'my-location' | 'laptop' | 'directions' | 'maps' | 'uber' | 'instagram'
    class Icon extends STextComponent<{
        name: IconName
    }> {}

    // View
    type ViewStyleName =
        | 'fill-parent' | 'overlay' | 'space-between' | 'wrap'
        | 'horizontal h-center' | 'horizontal h-start' | 'horizontal h-end' | 'horizontal v-center' | 'horizontal v-start' | 'horizontal v-end'
        | 'vertical h-center' | 'vertical h-start' | 'vertical h-end' | 'vertical v-center' | 'vertical v-start' | 'vertical v-end'
    class View extends SViewComponent {}

    // Screen
    type ScreenStyleName = 'full-screen' | 'paper'
    class Screen extends SViewComponent {}

    // TouchableOpacity
    class TouchableOpacity extends Component<RN.TouchableOpacityProps> {}

    // Touchable
    class Touchable extends Component<RN.TouchableOpacityProps | RN.TouchableNativeFeedbackProps> {}

    // Overlay
    type OverlayStyleName = 'fill-parent' | 'rounded-small'
    class Overlay extends SViewComponent {}

    // TextInput
    class TextInput extends SComponent<RN.TextInputProps & {
        style?: ViewStyleValue<{
            placeholderTextColor?: string
            selectionColor?: string
        }>
    }> {}

    // Video
    class Video extends SComponent<{
        source?: {
            uri: string
        }
        poster?: string
        width?: number
        height?: number
        style?: {
            container?: ViewStyleValue
        }
    }> {}

    // Lightbox
    class Lightbox extends SComponent<{
        activeProps?: object
        renderHeader?: () => ReactNode
        renderContent?: () => ReactNode
        underlayColor?: string
        backgroundColor?: string
        didOpen?: () => void
        onOpen?: () => void
        willClose?: () => void
        onClose?: () => void
        springConfig?: {
            tension: number
            friction: number
        }
        swipeToDismiss?:  boolean
    }> {}

    // Html
    class Html extends SComponent<{
        body: string
        renderElement?: (element: any) => ReactNode
        style?: {
            container?: ViewStyleValue
            [tag: string]: any
        }
    }> {}

    // FormGroup
    class FormGroup extends SViewComponent {}


    // Theme
    const getTheme: (variables: SimpleObject) => SimpleObject
    const defaultThemeVariables: SimpleObject
    const dimensionRelativeToIphone: (dimension: number, actualRefVal: number) => number

}
