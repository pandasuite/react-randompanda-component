import React from 'react';
import PropTypes from 'prop-types';

function srcToData(src) {
  const matches = src.match(/photo-[0-9a-zA-Z-]+/);
  return { name: (matches || [])[0], src };
}

class PandaExampleImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSrc: props.src,
    };
    this.getSource = this.getSource.bind(this);
    this.generatePandaImageUrl = this.generatePandaImageUrl.bind(this);
    this.onRefreshClick = this.onRefreshClick.bind(this);
  }

  onRefreshClick() {
    const { searchTerm } = this.props;

    this.generatePandaImageUrl(searchTerm);
  }

  getSource() {
    const { imageSrc } = this.state;

    return srcToData(imageSrc);
  }

  static getDerivedStateFromProps(props, state) {
    const { src, onImageChanged } = props;

    if (src && src !== state.oldPathSrc && src !== state.imageSrc) {
      if (onImageChanged) {
        onImageChanged(srcToData(src));
      }
      return {
        imageSrc: src,
        oldPathSrc: src,
      };
    }
    return state;
  }

  generatePandaImageUrl(term = 'panda') {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', `https://source.unsplash.com/featured/?${term}`);

    xhr.onreadystatechange = function onreadystatechange() {
      if (xhr.readyState === 4) {
        this.setState({ imageSrc: xhr.responseURL });
      }
    }.bind(this);
    xhr.send();
  }

  render() {
    const { imageSrc } = this.state || {};
    const { searchTerm, refreshButton } = this.props;

    if (imageSrc == null && refreshButton) {
      this.generatePandaImageUrl(searchTerm);
    }

    return (
      <>
        <img id="featured" alt="Loading..." src={imageSrc} />
        {refreshButton && (
          <>
            <br />
            <button type="button" onClick={this.onRefreshClick}>Refresh</button>
          </>
        )}
      </>
    );
  }
}

PandaExampleImage.propTypes = {
  src: PropTypes.string,
  searchTerm: PropTypes.string,
  refreshButton: PropTypes.bool,
  onImageChanged: PropTypes.func,
};

PandaExampleImage.defaultProps = {
  src: null,
  searchTerm: 'panda',
  refreshButton: false,
  onImageChanged: null,
};

export default PandaExampleImage;
