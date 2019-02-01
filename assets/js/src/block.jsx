/**
 * BLOCK: asenese
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import '../../css/typed.scss';

import Typed from 'typed.js';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks;
const { InspectorControls } = wp.editor;
const {
  PanelBody,
  Button,
  IconButton,
  PanelRow,
  ToggleControl,
  SelectControl,
  TextControl,
} = wp.components;
const { Fragment, Component } = wp.element;
/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
const blockAttributes = {
  loop: {
    type: 'boolean',
    default: false,
  },
  loopCount: {
    type: 'number',
    default: -1,
    description: 'amount of loops (set -1 for Inifite)',
    show: 'loop',
  },
  typeSpeed: {
    type: 'number',
    default: 0,
    description: 'type speed in milliseconds',
  },
  startDelay: {
    type: 'number',
    default: 0,
    description: 'time before typing starts in milliseconds',
  },
  backSpeed: {
    type: 'number',
    default: 0,
    description: 'backspacing speed in milliseconds',
  },
  smartBackspace: {
    type: 'boolean',
    default: true,
    description: "only backspace what doesn't match the previous string",
  },
  shuffle: {
    type: 'boolean',
    default: false,
    description: 'shuffle the strings',
  },
  backDelay: {
    type: 'number',
    default: 700,
    description: 'time before backspacing in milliseconds',
  },
  fadeOut: {
    type: 'boolean',
    default: false,
    description: 'Fade out instead of backspace',
  },
  fadeOutClass: {
    type: 'string',
    default: 'typed-fade-out',
    description: 'css class for fade animation',
    show: 'fadeOut',
  },
  fadeOutDelay: {
    type: 'number',
    default: 500,
    description: 'Fade out delay in milliseconds',
    show: 'fadeOut',
  },
  showCursor: {
    type: 'boolean',
    default: true,
  },
  cursorChar: {
    type: 'string',
    default: '|',
    description: 'character for cursor',
    show: 'showCursor',
  },
  contentType: {
    type: 'select',
    default: 'html',
    values: ['html', 'plaintext'],
  },
  strings: {
    type: 'array',
    default: ['Typing effect'],
  },
};

registerBlockType('nine3/typing', {
  // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
  title: __('Typing effect'), // Block title.
  icon: 'welcome-write-blog', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
  category: 'formatting', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
  keywords: [__('Typing'), __('effect')],

  // the "type" key is not accessible inside the props.attributes but we need it to render the panel options properly
  attributes: Object.assign({}, blockAttributes, {
    previewMode: {
      type: 'boolean',
      default: true,
    },
  }),

  multiple: true,

  /**
   * The edit function describes the structure of your block in the context of the editor.
   * This represents what the editor will render when the block is used.
   *
   * The "edit" property must be a valid function.
   *
   * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
   *
   * @param {object} props Gutenberg props.
   * @return {JSX} JSX block.
   */
  edit: class extends Component {
    constructor(props) {
      super(...arguments);
      this.props = props;

      this.addString = this.addString.bind(this);
      this.onStringChange = this.onStringChange.bind(this);
      this.animateNow = this.animateNow.bind(this);

      this._options = {};
      this._timeout = null;
    }

    // Add a new string
    addString() {
      let strings = this.props.attributes.strings.slice();

      strings.push('Another string');
      this.props.setAttributes({ strings });
    }

    /**
     * Remove the string at the specified index
     *
     * @param {int} index the index to remove
     */
    removeString(index) {
      let strings = this.props.attributes.strings.slice();
      strings.splice(index, 1);

      this.props.setAttributes({ strings });
    }

    /**
     * Update the specified string
     *
     * @param {int} index the string index
     * @param {string} string the new string
     */
    onStringChange(index, string) {
      let strings = this.props.attributes.strings.slice();

      strings[index] = string;
      this.props.setAttributes({ strings });
    }

    /**
     * Update the 'boolean' attribute
     *
     * @param {string} key they attribute key to update
     * @param {mixed} value the attribute value
     */
    onAttributeChange(key, value) {
      const v = {};
      v[key] = value;

      this.props.setAttributes(v);
    }

    onInputChange(key, value, a) {
      console.info(key, value, a);
    }

    isEquivalent(a, b) {
      // Create arrays of property names
      var aProps = Object.getOwnPropertyNames(a);
      var bProps = Object.getOwnPropertyNames(b);

      // If number of properties is different,
      // objects are not equivalent
      if (aProps.length != bProps.length) {
        return false;
      }

      for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
          return false;
        }
      }

      // If we made it this far, objects
      // are considered equivalent
      return true;
    }

    /**
     * Execute the animation
     *
     */
    animateNow() {
      this.initTyped(0);
    }

    /**
     * Debounce the animation
     */
    initTyped(timeout = 500) {
      clearTimeout(this._timeout);

      if (this.props.attributes.previewMode === false && timeout > 0) {
        return;
      }
      this._timeout = setTimeout(this._initTyped.bind(this, timeout), timeout);
    }

    /**
     * Run the animation
     */
    _initTyped(timeout) {
      const options = Object.assign({}, this.props.attributes);

      if (options.loopCount < 0) {
        options.loopCount = Infinity;
      }

      if (this._typed) {
        /**
         * componentDidUpdate is called even if the data hasn't changed, like when the
         * user click in or out of the component.
         * We're making sure that something has changed just because is very annoying seeing the
         * animation running when nothing has changed.
         */
        if (timeout > 0 && this.isEquivalent(this._options, options)) {
          return;
        }

        this._typed.stop();
        this._typed.destroy();
      }

      this._typed = new Typed(
        `[data-block="${this.props.clientId}"] .typed-wrapper`,
        options
      );

      this._options = options;
    }

    /**
     * Initialise Typed.js
     */
    componentDidMount() {
      this.initTyped(1000);
    }

    componentDidUpdate() {
      this.initTyped();
    }

    render() {
      const { className, attributes } = this.props;
      const attributeKeys = Object.keys(blockAttributes).filter(
        key => key !== 'strings' && key !== 'className'
      );

      return (
        <Fragment>
          <InspectorControls>
            <PanelBody title={__('Strings')} className="typed-panel-body">
              <PanelRow className="animate-row">
                <ToggleControl
                  label="Preview Mode"
                  checked={attributes.previewMode}
                  onChange={this.onAttributeChange.bind(this, 'previewMode')}
                  toolip="Automatically runs the animation when a parameter changes"
                />

                {/* Trigger the animation */}
                <Button
                    isDefault
                    onClick={this.animateNow}
                  >
                  {__('Animate!')}
                </Button>
              </PanelRow>

              {attributes.strings.map((string, index) => {
                return (
                  <div className="string-wrapper">
                    <TextControl
                      key={`key-${index}`}
                      className="plain-text"
                      value={string}
                      onChange={this.onStringChange.bind(this, index)}
                    />
                    <IconButton
                      icon="trash"
                      value={__('Remove string')}
                      onClick={this.removeString.bind(this, index)}
                    />
                  </div>
                );
              })}
              <Button isDefault className="add-more" onClick={this.addString}>
                {__('Add string')}
              </Button>
            </PanelBody>

            {/* Effects settings */}
            <PanelBody
              title={__('Effect settings')}
              className="effect-settings"
            >
              {attributeKeys.map(key => {
                // From camelCase to -> camel Case
                const camel = key.split(/(?=[A-Z])/).join(' ');
                const label = camel.charAt(0).toUpperCase() + camel.slice(1); // capitalise first letter.
                const value = attributes[key];
                const type = blockAttributes[key].type;
                const attribute = blockAttributes[key];

                // Is it hidden?
                if (attribute.show && attributes[attribute.show] === false) {
                  return;
                }

                switch (type) {
                  case 'boolean':
                    return (
                      <PanelRow key={key}>
                        <ToggleControl
                          label={label}
                          checked={value}
                          onChange={this.onAttributeChange.bind(this, key)}
                          help={attribute.description}
                        />
                      </PanelRow>
                    );
                  case 'select':
                    // contentType?
                    return (
                      <PanelRow key={key}>
                        <SelectControl
                          label={label}
                          value={value}
                          options={attribute.values.map(value => {
                            return {
                              label: value,
                              value,
                            };
                          })}
                          onChange={this.onAttributeChange.bind(this, key)}
                          help={attribute.description}
                        />
                      </PanelRow>
                    );
                  default:
                    return (
                      <PanelRow key={key}>
                        <TextControl
                          type={type === 'string' ? 'text' : type}
                          label={label}
                          value={value}
                          onChange={this.onAttributeChange.bind(this, key)}
                          help={attribute.description}
                        />
                      </PanelRow>
                    );
                }
              })}
            </PanelBody>
          </InspectorControls>

          <div className={className}>
            <span className="typed-wrapper"></span>
          </div>
        </Fragment>
      );
    }
  },

  /**
   * The save function defines the way in which the different attributes should be combined
   * into the final markup, which is then serialized by Gutenberg into post_content.
   *
   * The "save" property must be specified and must be a valid function.
   *
   * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
   *
   * @param {object} props Gutenberg props.
   * @return {JSX} JSX block.
   */
  save: () => null,
});
