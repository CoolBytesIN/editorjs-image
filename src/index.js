require('./index.css');

const imageIcon = require('./icons/image.js');
const withBorderIcon = require('./icons/withBorder.js');
const stretchedIcon = require('./icons/stretched.js');
const withBackgroundIcon = require('./icons/withBackground.js');

/**
 * Image plugin for Editor.js
 * Supported config:
 *     * imageAlt {string} (Default: 'picture')
 *     * enableCaption {boolean} (Default: false)
 *
 * @class Image
 * @typedef {Image}
 */
export default class Image {
  /**
   * Editor.js Toolbox settings
   *
   * @static
   * @readonly
   * @type {{ icon: any; title: string; }}
   */
  static get toolbox() {
    return {
      icon: imageIcon, title: 'Image',
    };
  }

  /**
   * To notify Editor.js core that read-only is supported
   *
   * @static
   * @readonly
   * @type {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Automatic sanitize config for Editor.js
   *
   * @static
   * @readonly
   * @type {{ url: boolean; caption: {};withBorder: boolean; withBackground: boolean; stretched: boolean; }}
   */
  static get sanitize() {
    return {
      url: false, // Disallow HTML
      caption: {}, // only tags from Inline Toolbar 
      withBorder: false, // Disallow HTML
      withBackground: false, // Disallow HTML
      stretched: false, // Disallow HTML
    };
  }

  /**
   * Creates an instance of Image.
   *
   * @constructor
   * @param {{ api: {}; readOnly: boolean; config: {}; data: {}; }} props
   */
  constructor({
    api, readOnly, config, data, block,
  }) {
    this._api = api;
    this._readOnly = readOnly;
    this._config = config || {};
    this._data = this._normalizeData(data);
    this._block = block;
    this._CSS = {
      wrapper: 'ce-image-wrapper',
      input: this._api.styles.input,
      image: 'ce-image',
      caption: 'ce-image-caption',
    };
    this._element = this._getElement();
  }

  /**
   * User's preference for enabling caption
   *
   * @readonly
   * @type {boolean}
   */
  get userEnableCaption() {
    return Boolean(this._config.enableCaption);
  }

  /**
   * To normalize input data
   *
   * @param {*} data
   * @returns {{ style: string; lineWidth: number; lineThickness: string; }}
   */
  _normalizeData(data) {
    const newData = {};
    if (typeof data !== 'object') {
      data = {};
    }

    newData.url = data.url || '';
    newData.caption = data.caption || '';
    newData.withBorder = Boolean(data.withBorder);
    newData.stretched = Boolean(data.stretched);
    newData.withBackground = Boolean(data.withBackground);
    return newData;
  }

  /**
   * Create and return block element
   *
   * @returns {*}
   */
  _getElement() {
    this._wrapper = document.createElement('div');
    this._wrapper.classList.add(this._CSS.wrapper);

    // If saved data is being rendered
    if (this._data.url){
      this._createImage(this._data.url);
      return this._wrapper;
    }

    const input = document.createElement('input');
    input.classList.add(this._CSS.input);
    input.placeholder = 'Paste an image URL...';
    // input.value = this._data.url;

    input.addEventListener('paste', (event) => {
      this._createImage(event.clipboardData.getData('text'));
    });

    input.addEventListener('keydown', (event) => {
      if (event.code === 'Enter') {
        this._createImage(event.target.value);
      }
    });

    this._wrapper.appendChild(input);
    return this._wrapper;
  }

  /**
   * To create an image upon paste or Enter key
   *
   * @param {string} url
   */
  _createImage(url){
    const image = document.createElement('img');
    image.classList.add(this._CSS.image);
    image.src = url;
    image.alt = this._config.imageAlt || 'picture';
    this._data.url = url;

    this._wrapper.innerHTML = '';
    this._wrapper.appendChild(image);

    // Only show caption if enabled
    if (this.userEnableCaption) {
      this._caption = document.createElement('input');
      this._caption.classList.add(this._CSS.caption);
      this._caption.placeholder = 'Enter a caption';
      this._caption.value = this._data.caption;
      this._caption.contentEditable = !this._readOnly;
      this._wrapper.appendChild(this._caption);
    }

    // For adding relevant block settings classes
    this._acceptTuneView();
  }

  /**
   * HTML element to render on the UI by Editor.js
   *
   * @returns {*}
   */
  render() {
    return this._element;
  }

  /**
   * Editor.js save method to extract block data from the UI
   *
   * @returns {{ url: string; caption: string; }}
   */
  save() {
    return {
      url: this._data.url,
      caption: this._caption && this._caption.value ? this._caption.value : '',
      withBorder: this._data.withBorder,
      stretched: this._data.stretched,
      withBackground: this._data.withBackground,
    }
  }

  /**
   * Editor.js validation (on save) code for this block
   * - Skips empty URLs
   *
   * @param {*} savedData
   * @returns {boolean}
   */
  validate(savedData){
    if (!savedData.url.trim()){
      return false;
    }
    return true;
  }

  /**
   * Block Tunes Settings
   *
   * @returns {[{*}]}
   */
  renderSettings() {
    return [
      {
        icon: withBorderIcon,
        label: this._api.i18n.t('Add Border'),
        onActivate: () => this._toggleTune('withBorder'),
        isActive: Boolean(this._data.withBorder),
        closeOnActivate: true,
        toggle: true,
      },
      {
        icon: stretchedIcon,
        label: this._api.i18n.t('Stretch Image'),
        onActivate: () => this._toggleTune('stretched'),
        isActive: Boolean(this._data.stretched),
        closeOnActivate: true,
        toggle: true,
      },
      {
        icon: withBackgroundIcon,
        label: this._api.i18n.t('Add Background'),
        onActivate: () => this._toggleTune('withBackground'),
        isActive: Boolean(this._data.withBackground),
        closeOnActivate: true,
        toggle: true,
      }
    ]
  }

  /**
   * To toggle the state of the setting
   *
   * @param {string} tune
   */
  _toggleTune(tune) {
    this._data[tune] = !this._data[tune];
    this._acceptTuneView();
  }

  /**
   * Add specified class corresponding to the activated tunes
   * @private
   */
  _acceptTuneView() {
    this._wrapper.classList.toggle('withBorder', !!this._data.withBorder);
    this._wrapper.classList.toggle('withBackground', !!this._data.withBackground);
    // For stretching the image
    Promise.resolve().then(() => {
      this._block.stretched = !!this._data.stretched;
    })
    .catch(err => {
      console.error(err);
    });
  }
}
