import React, { useRef, useState } from 'react';
import './App.css';
import _ from 'lodash';

import PandaBridge from 'pandasuite-bridge';
import { usePandaBridge } from 'pandasuite-bridge-react';
import PandaExampleImage from './PandaExampleImage';

function App() {
  const pandaImageEl = useRef(null);
  const [backgroundColor, setBackgroundColor] = useState();

  const {
    /* We retrieve the properties defined in the pandasuite.json file */
    properties,
    /* We retrieve the markers defined in the pandasuite.json file
      but also those defined dynamically by the user when creating in the studio.
      See ```getSnapshotDataHook``` */
    markers,
    /* We retrieve the resources defined in the pandasuite.json file */
    resources,
    /* This is the last marker that was triggered. We can retrieve its data
      but we can also retrieve its parameters. */
    triggeredMarker,
  } = usePandaBridge(
    /* Default for properties, markers, resources and triggeredMarker. */
    {
    },
    /* Hooks */
    {
      markers: {
        /* This method is auto-generated
          it's called up by clicking on "Add Marker" from the studio. */
        getSnapshotDataHook: () => {
          const { name, src } = pandaImageEl.current.getSource();
          return { id: name, src };
        },
      },
      actions: {
        changeColor: ({ backgroundColor: bgColor }) => {
          setBackgroundColor(bgColor);
        },
      },
      synchronization: {
        synchroImages: (percent) => {
          console.log(percent);
        },
      },
    },
  );

  const { 'my_image.png': myImage } = resources || {};
  console.log((myImage || {}).path);

  const { searchTerm } = properties || {};

  const { data, params } = triggeredMarker || {};
  let { src } = data || {};
  const { useless } = params || {};
  if (useless) {
    src = null;
  }

  const onImageChanged = ({ name, src: changedSrc }) => {
    const markerIndex = _.findIndex(markers, (m) => m.src === changedSrc);

    if (markerIndex !== -1) {
      PandaBridge.send(PandaBridge.SYNCHRONIZE, [(markerIndex * 100) / markers.length, 'synchroImages', true]);
      PandaBridge.send(PandaBridge.TRIGGER_MARKER, markers[markerIndex].id);
    }
    PandaBridge.send('imageChanged', [{ name, src: changedSrc }]);
  };

  return (
    <div className="App" style={{ backgroundColor }}>
      Hello Panda!
      <br />
      <br />
      <PandaExampleImage
        ref={pandaImageEl}
        src={src}
        searchTerm={searchTerm}
        refreshButton={PandaBridge.isStudio}
        onImageChanged={onImageChanged}
      />
    </div>
  );
}

export default App;
