import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './ReadMe.scss';

function ReadMe(): React.ReactElement {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/robertmay2003/curves/master/README.md')
      .then((response) => response.text())
      .then(setContent);
  }, []);

  return (
    <div className="px-5 readme-container">
      <ReactMarkdown source={content} />
    </div>
  );
}

export default ReadMe;
