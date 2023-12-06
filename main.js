
createCustomElement('input-region', [
  {
    'tag': 'style',
    'innerHTML': `
      .container {
        width: 300px;
        height: 300px;
        background-color: #ddd;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
      }
      .header {
        margin-right: auto;
        margin-top: 3px;
        margin-left: 3px;
      }
      .main {
        padding: 10px;
        flex-grow: 1;
        width: 100%;
        box-sizing: border-box;
      }
      .main > textarea {
        padding: 10px;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
      }
      #run-button {
        margin-left: auto;
        margin-right: 3px;
        margin-bottom: 3px;
        background-color: blue;
        color: white;
        border: none;
        border-radius: 5px;
      }`
  },
  {
    'tag': 'div',
    'class': 'container',
    'childElements': [
      {
        'tag': 'div',
        'class': 'header',
        'childElements': [
          {
            'tag': 'button',
            'innerText': 'Components'
          },
          {
            'tag': 'button',
            'innerText': 'Main'
          }
        ]
      },
      {
        'tag': 'div',
        'class': 'main',
        'childElements': [
          {
            'tag': 'textarea'
          }
        ]
      },
      {
        'tag': 'button',
        'id': 'run-button',
        'innerText': 'Run'
      }
    ]
  }
]);
const upperHalfNode = document.createElement('input-region');

createCustomElement('output-region', []);
const lowerHalfNode = document.createElement('output-region');

const mainContents = [
  {
    tag: 'style',
    innerHTML: `
      :host {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
      }`
  },
  upperHalfNode,
  lowerHalfNode
];

const MainElement = createCustomElement('main-element', mainContents);
