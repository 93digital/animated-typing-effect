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
	TextControl
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
  preview: {
    type: 'boolean',
    default: true,
  },
  typeSpeed: {
    type: 'number',
    default: 0,
  },
  startDelay: {
    type: 'number',
    default: 0,
  },
  backSpeed: {
    type: 'number',
    default: 0,
  },
  smartBackspace: {
    type: 'boolean',
    default: true,
  },
  shuffle: {
    type: 'boolean',
    default: false,
  },
  backDelay: {
    type: 'number',
    default: 700,
  },
  fadeOut: {
    type: 'boolean',
    default: false,
  },
  fadeOutClass: {
    type: 'string',
    default: 'typed-fade-out',
  },
  fadeOutDelay: {
    type: 'number',
    default: 500,
  },
  shouwCursor: {
    type: 'boolean',
    default: true,
  },
  cursorChar: {
    type: 'boolean',
    default: true,
  },
  autoInsertCss: {
    type: 'boolean',
    default: true,
  },
  attr: {
    type: 'string',
    default: '',
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
  attributes: blockAttributes,

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

    initTyped(timeout = 100) {
      const options = Object.assign({}, this.props.attributes);
      clearTimeout(this._timeout);

      if (this.props.attributes.preview === false) {
        return;
      }

      console.info(preview);
      this._timeout = setTimeout(clientId => {
        // const element = document.querySelector(`[data-block="${clientId}"]`)
        new Typed(`[data-block="${clientId}"]`, options);
      }, timeout, this.props.clientId);
    }

    /**
     * Initialise Typed.js
     */
    componentDidMount() {
      this.initTyped(0);
    }

    componentDidUpdate() {
      this.initTyped();
    }

    render() {
      const { className, attributes } = this.props;
      const attributeKeys = Object.keys(blockAttributes).filter(
        key => key !== 'strings'
      );

      return (
        <Fragment>
          <InspectorControls>
            <PanelBody title={__('Strings')} className="typed-panel-body">
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

                switch (type) {
                  case 'boolean':
                    return (
                      <PanelRow
                        key={key}
                      >
                        <ToggleControl
                          label={label}
                          checked={value}
                          onChange={this.onAttributeChange.bind(this, key)}
                        />
                      </PanelRow>
                    );
                  case 'select':
                    // contentType?
                    return (
                      <PanelRow
                        key={key}
                      >
                        <SelectControl
                          label={label}
                          value={value}
                          options={blockAttributes[key].values.map(value => {
                            return {
                              label: value,
                              value,
                            };
                          })}
                          onChange={this.onAttributeChange.bind(this, key)}
                        />
                      </PanelRow>
                    );
                  default:
                    return (
                      <PanelRow
                        key={key}
                      >
                        <TextControl
                          type={type}
                          label={label}
                          value={value}
                          onChange={this.onAttributeChange.bind(this, key)}
                        />

                      </PanelRow>
                    );
                }
              })}
            </PanelBody>
          </InspectorControls>

          <div className={className}>
          <div className="typed-wrapper">
              {attributes.strings.map((string, index) => {
                return (
                  <p key={index}>{string}</p>
                )
              })}
            </div>
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
